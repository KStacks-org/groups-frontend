import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.response.use(undefined, async (error) => {
	const config = error.config as InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

	if (error.response?.status !== 401 || !config || config._retry) {
		throw error;
	}

	config._retry = true;

	await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, null, {
		withCredentials: true,
	});

	return api(config);
});

export default api;
