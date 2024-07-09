import base64url from 'base64-url';
import { isEmpty } from 'lodash';
import invariant from 'tiny-invariant';

const ACCESS_TOKEN_KEY = '@token';

const AUTH_EXPIRY_BUFFER = 60; // 1 minute

class ServiceAuth {
	static verifyToken(buffer = AUTH_EXPIRY_BUFFER): boolean {
		try {
			const token = this.getToken();
			invariant(typeof token === 'string' && !isEmpty(token.trim()), 'Invalid token');

			const now = Math.round(Date.now() / 1000);
			const parts = token.split('.');

			const JWT_TOKEN_PART_LENGTH = 3;
			invariant(parts.length === JWT_TOKEN_PART_LENGTH, 'Not a valid JWT');

			// Get middle part in payload string
			const payload = JSON.parse(base64url.decode(parts[1]));

			invariant(payload.exp && now < payload.exp + buffer, 'Token expired');
			return true;
		} catch (e) {}
		return false;
	}

	static getToken(): string | null {
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	static setToken(token: string | null): void {
		if (!token) {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			return;
		}
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
	}
}

export default ServiceAuth;
