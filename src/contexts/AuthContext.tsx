import ServiceAPI from '@/services/service-api';
import ServiceAuth from '@/services/service-auth';
import { TUser } from '@/type/data/auth.type';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
	children: ReactNode;
}

interface AuthContextDefault {
	user: TUser | null;
	isChecked: boolean;
	authenticate: (token: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextDefault>({
	user: null,
	isChecked: false,
	authenticate: async () => false,
	logout: async () => {},
});

const AuthContextProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<TUser | null>(null);
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const authenticate = async (token: string) => {
		try {
			ServiceAuth.setToken(token);

			const authUser = await ServiceAPI.me();
			setUser(authUser);

			return true;
		} catch (e) {
			setUser(null);
		}
		return false;
	};

	const logout = async () => {
		ServiceAuth.setToken(null);
		setUser(null);
	};

	// Load token from localStorage
	useEffect(() => {
		if (typeof window.localStorage !== 'undefined') {
			(async () => {
				const token = ServiceAuth.getToken();
				if (token) {
					await authenticate(token);
				}
				setIsChecked(true);
			})();
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isChecked,
				authenticate,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthContextProvider };
