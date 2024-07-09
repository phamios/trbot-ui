export type TChain = {
	id: number;
	chainId: string;
	name: string;
	rpcUri: string;
	wsRpcUri: string;
	createdAt: number;
	updatedAt: number;
};

export type TAddChain = {
	chainId: string;
	name: string;
	rpcUri?: string;
	wsRpcUri?: string;
};

export type TUpdateChain = {
	name?: string;
	rpcUri?: string;
	wsRpcUri?: string;
};
