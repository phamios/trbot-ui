export type TUser = {
	email: string;
	firstName: string;
	lastName: string;
};

export type TJwtTokenData = {
	expiresIn: number;
	token: string;
};
