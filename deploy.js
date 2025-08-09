const http = require('http');
const { exec } = require('child_process');

// Для drag-and-drop использую 3002 порт! 11:41
const PORT = 3002;
const SECRET_TOKEN = 'supersecrettoken123';

http
	.createServer((req, res) => {
		const url = new URL(req.url, `http://${req.headers.host}`);
		const token = url.searchParams.get('token');

		console.log(`Получен запрос на ${url.pathname} с токеном: ${token}`);

		if (url.pathname === '/deploy' && token === SECRET_TOKEN) {
			console.log('✅ Токен верный. Запускаю обновление...');

			const commands = [
				'cd /root/drag-and-drop',
				'git reset', // сбрасываем индекс и изменения в файлах
				'git checkout .', // откатываем все локальные изменения
				'git pull origin master', // теперь можно обновиться
				'cd frontend',
				'npm install',
				'npm run build',
				'cd ..',
				'rm -rf /var/www/drag-and-drop/*',
				'mkdir -p /var/www/drag-and-drop',
				'cp -r /root/drag-and-drop/frontend/dist/* /var/www/drag-and-drop/',
				'cd backend',
				'pm2 restart drag-and-drop',
			];

			const cmd = commands.join(' && ');

			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					console.error(`❌ Ошибка: ${error.message}`);
					console.error(`STDERR: ${stderr}`);
					res.writeHead(500);
					return res.end('Ошибка при деплое');
				}

				console.log(`✅ Команды выполнены успешно`);
				console.log(`STDOUT: ${stdout}`);
				res.writeHead(200);
				res.end('Деплой успешно выполнен');
			});
		} else {
			console.log('🚫 Неверный маршрут или токен');
			res.writeHead(403);
			res.end('Forbidden');
		}
	})
	.listen(PORT, () => {
		console.log(
			`📡 Сервер ожидает команды на http://localhost:${PORT}/deploy?token=supersecrettoken123`
		);
	});
