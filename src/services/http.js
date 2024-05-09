import { toast } from 'react-toastify';

class HttpService {
	static baseUrl = process.env.REACT_APP_API_URL;

	static getHeaders(withoutJson) {
		const headers = {};
		const token = localStorage.getItem('token');

		if (!withoutJson)
			headers['Content-Type'] = 'application/json';
		if (token) headers['Authorization'] = `Bearer ${token}`;

		return headers;
	}

	static async handleResponse(response) {
		const isSuccess =
			response.status >= 200 && response.status <= 300;
		const result = await response.json();

		if (!isSuccess) toast.error(result.msg);

		return { isSuccess, result };
	}

	static async get(endpoint) {
		try {
			const response = await fetch(
				`${this.baseUrl}${endpoint}`,
				{
					headers: this.getHeaders(),
				}
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return await response.json();
		} catch (error) {
			console.error('Error making GET request:', error);
			throw error;
		}
	}

	static async post(endpoint, data, withoutJson) {
		try {
			const response = await fetch(
				`${this.baseUrl}${endpoint}`,
				{
					method: 'POST',
					headers: this.getHeaders(withoutJson),
					body: withoutJson ? data : JSON.stringify(data),
				}
			);
			const { isSuccess, result } =
				await HttpService.handleResponse(response);

			return {
				isSuccess,
				data: result,
			};
		} catch (error) {
			console.error('Error making POST request:', error);
			throw error;
		}
	}

	static async put(endpoint, data) {
		try {
			const response = await fetch(
				`${this.baseUrl}${endpoint}`,
				{
					method: 'PUT',
					headers: this.getHeaders(),
					body: JSON.stringify(data),
				}
			);
			const { isSuccess, result } =
				await HttpService.handleResponse(response);

			if (!isSuccess) toast.error(result.msg);

			return {
				isSuccess,
				data: result,
			};
		} catch (error) {
			console.error('Error making PUT request:', error);
			throw error;
		}
	}

	static async delete(endpoint) {
		try {
			const response = await fetch(
				`${this.baseUrl}${endpoint}`,
				{
					headers: this.getHeaders(),
					method: 'DELETE',
				}
			);
			const { isSuccess, result } =
				await HttpService.handleResponse(response);

			return {
				isSuccess,
				data: result,
			};
		} catch (error) {
			console.error('Error making DELETE request:', error);
			throw error;
		}
	}
}

export default HttpService;
