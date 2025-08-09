import jsonServer from 'json-server';
import cors from 'cors';
import { join } from 'path';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env
dotenv.config();

const server = jsonServer.create();
const router = jsonServer.router(join(process.cwd(), 'data', 'db.json'));
const middlewares = jsonServer.defaults();

// Используем CORS
server.use(cors());
server.use(middlewares);
server.use('/api', router);

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`JSON Server is running on port ${PORT}`);
});
