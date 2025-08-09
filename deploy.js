const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

// Настройки для drag-and-drop!
const PORT = 3002;
const WEBHOOK_SECRET = 'supersecrettoken123'; // Должен совпадать с GitHub
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
				if (!verifySignature(body, signature, WEBHOOK_SECRET)) {
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

				console.log('✅ Вебхук верен. Запускаю деплой...');

				const commands = [
					`cd ${REPO_DIR}`,
					'git reset --hard HEAD', // полная очистка
					'git checkout .', // откат неотслеживаемых
					'git pull origin main', // обновляем код
					'cd frontend',
					'npm install',
					'npm run build',
					'cd ..',
					'rm -rf /var/www/drag-and-drop/*',
					'mkdir -p /var/www/drag-and-drop',
					'cp -r frontend/dist/* /var/www/drag-and-drop/',
					'cd backend',
					'pm2 restart drag-and-drop',
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
		console.log(`📡 Деплой-сервер запущен: http://ваш-сервер:${PORT}/deploy`);
	});

// Функция проверки подписи GitHub
function verifySignature(payload, signature, secret) {
	if (!signature) return false;
	const expected =
		'sha256=' +
		crypto.createHmac('sha256', secret).update(payload).digest('hex');
	return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
