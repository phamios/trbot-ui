import { TChain } from './chains.type';

export type TTradingContract = {
	id: number;
	chainId: string;
	decimals: number;
	name: string;
	symbol: string;
	address: string;
	gasPrice?: string;
	gasLimit?: string;
	slippage?: number;
	chain: TChain;
	createdAt: number;
	updatedAt: number;
};

export type TAddTradingContract = {
	chainId: string;
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	routerId: number;
	gasPrice: string;
	gasLimit: string;
	slippage: number;
};

export type TUpdateTradingContract = {
	chainId: string;
	address: string;
	decimals: number;
	name: string;
	symbol: string;
	routerId: number;
	gasPrice: string;
	gasLimit: string;
	slippage: number;
};
