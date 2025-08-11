import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

const PORT = 3002;
const SECRET_TOKEN = 'supersecrettoken123';
const REPO_DIR = '/root/drag-and-drop';

http
	.createServer((req, res) => {
		let body = '';

		req.on('data', chunk => {
			body += chunk.toString();
		});

		req.on('end', () => {
			const url = new URL(req.url, `http://${req.headers.host}`);
			console.log(`Получен запрос на ${url.pathname}`);

			// Проверяем, что это вебхук от GitHub
			if (url.pathname === '/deploy') {
				// Проверяем подпись (X-Hub-Signature-256)
				const signature = req.headers['x-hub-signature-256'];
				if (!verifySignature(body, signature, SECRET_TOKEN)) {
					console.log('🚫 Неверная подпись');
					res.writeHead(401);
					return res.end('Unauthorized');
				}

				// Проверяем, что это push в main
				const payload = JSON.parse(body);
				if (payload.ref !== 'refs/heads/main') {
					console.log('🚫 Не в ветку main — игнорируем');
					res.writeHead(200);
					return res.end('Ignored');
				}

				console.log('✅ Вебхук верен. Запускаю обновление...');

				const commands = [
					`cd ${REPO_DIR}`,
					'git reset --hard HEAD',
					'git checkout .',
					'git pull origin main',

					// Установка зависимостей frontend
					'cd frontend',
					'npm install || echo "⚠️ npm install failed or skipped"',

					// Сборка frontend (если есть build)
					'if npm run build; then echo "✅ Frontend успешно собран"; else echo "⚠️ Скрипт build не найден или пропущен"; fi',

					// Копирование
					'cd ..',
					'rm -rf /var/www/drag-and-drop/*',
					'mkdir -p /var/www/drag-and-drop',
					'cp -r frontend/dist/* /var/www/drag-and-drop/ 2>/dev/null || echo "⚠️ Нет файлов для копирования (возможно, сборка не выполнена)"',

					// Сборка backend (если есть build)
					'cd backend',
					'echo "🔧 Проверка и сборка backend..."',
					'if npm run build; then echo "✅ Backend успешно собран"; else echo "⚠️ Скрипт build не найден или пропущен"; fi',

					// Перезапуск PM2
					'cd ..',
					'pm2 restart drag-and-drop || echo "⚠️ Ошибка перезапуска drag-and-drop"',
					`pm2 restart drag-and-drop-deploy:${PORT} --update-env || echo "⚠️ Ошибка перезапуска деплой-сервера"`,
				];

				const cmd = commands.join(' && ');

				exec(cmd, { cwd: REPO_DIR }, (error, stdout, stderr) => {
					if (error) {
						console.error(`❌ Ошибка: ${error.message}`);
						console.error(`STDERR: ${stderr}`);
						res.writeHead(500);
						return res.end('Ошибка при деплое');
					}

					console.log(`✅ Деплой успешен`);
					res.writeHead(200);
					res.end('Деплой успешно выполнен');
				});
			} else {
				console.log('🚫 Неверный маршрут');
				res.writeHead(404);
				res.end('Not Found');
			}
		});
	})
	.listen(PORT, '0.0.0.0', () => {
		console.log(
			`📡 Деплой-сервер запущен: http://194.58.114.184:${PORT}/deploy`
		);
	});

// Функция проверки подписи GitHub
function verifySignature(payload, signature, secret) {
	if (!signature) return false;
	const expected =
		'sha256=' +
		crypto.createHmac('sha256', secret).update(payload).digest('hex');
	return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
