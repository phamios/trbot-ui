import COLORS from '@/config/colors';

export enum SnipeStatus {
	INIT = 1,
	SNIPING = 2,
	SWAPPING = 3,
	DONE = 4,
	ERROR = -1,
}

export enum SnipeType {
	FOR_SWAP_ETH_TO_TOKEN = 1,
}

export type TSnipe = {
	id: number;
	rpcUri: string;
	wsRpcUri: string;
	data: string;
	snipedAmountOut: string;
	exactAmountIn: string;
	status: SnipeStatus;
	contractId: number;
	createdAt: number;
	updatedAt: number;
};

export type TSnipeAction = {
	contractId: number;
	routerId: number;
	snipedAmountOut: string;
	exactAmountIn: string;
	rpcUri?: string;
	wsRpcUri?: string;
};

export type TSnipeData = Pick<TSnipe, 'status' | 'data'> & {
	logs: string;
};

export const parseSnipeStatus = (status: SnipeStatus) => {
	const statusTexts = {
		[SnipeStatus.INIT]: {
			label: 'Initiating',
			color: COLORS.INFO.code,
		},
		[SnipeStatus.SNIPING]: {
			label: 'Snipping',
			color: COLORS.PRIMARY.code,
		},
		[SnipeStatus.SWAPPING]: {
			label: 'Swapping',
			color: COLORS.INFO.code,
		},
		[SnipeStatus.DONE]: {
			label: 'Success',
			color: COLORS.SUCCESS.code,
		},
		[SnipeStatus.ERROR]: {
			label: 'Failed',
			color: COLORS.DANGER.code,
		},
	};
	return statusTexts[status];
};
