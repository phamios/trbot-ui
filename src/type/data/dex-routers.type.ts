import { TChain } from './chains.type';
import { TDEX } from './dexes.type';

export enum DEXRouterProtocolVersion {
	V1 = '1',
	V2 = '2',
	V3 = '3',
}

export const DEXRouterProtocolVersionValues = Object.values(DEXRouterProtocolVersion);
export const DEXRouterProtocolVersionOptions = [
	{ label: 'Version 1', value: DEXRouterProtocolVersion.V1 },
	{ label: 'Version 2', value: DEXRouterProtocolVersion.V2 },
	{ label: 'Version 3', value: DEXRouterProtocolVersion.V3 },
];

export enum DEXRouterType {
	ROUTER02 = 'router02',
	UNIVERSAL = 'universal',
}

export const DEXRouterTypeValues = Object.values(DEXRouterType);
export const DEXRouterTypeOptions = [
	{ label: 'Router02', value: DEXRouterType.ROUTER02 },
	{ label: 'Universal Router', value: DEXRouterType.UNIVERSAL },
];

export type TDEXRouter = {
	id: number;
	name: string;
	address: string;
	protocolVersion: DEXRouterProtocolVersion;
	type: DEXRouterType;
	chain: TChain;
	dex: TDEX;
	createdAt: number;
	updatedAt: number;
};

export type TAddDEXRouter = {
	name: string;
	address: string;
	protocolVersion: DEXRouterProtocolVersion;
	type: DEXRouterType;
	chainId: string;
	dexId: number;
};

export type TUpdateDEXRouter = {
	name: string;
	address: string;
	protocolVersion: DEXRouterProtocolVersion;
	type: DEXRouterType;
	chainId: string;
	dexId: number;
};
