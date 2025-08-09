import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';

const isProduction = import.meta.env.MODE === 'production';

const API_URL = isProduction
	? import.meta.env.VITE_API_URL
	: import.meta.env.VITE_SERVER_URL;

const options: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
};

export const apiClient = axios.create(options);

console.log('API URL: ', API_URL); // Для отладки
