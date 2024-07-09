export enum QueryKey {
	GET_CHAINS = 'get-chains',
	GET_DEXES = 'get-dexes',
	GET_DEX_ROUTERS = 'get-dex-routers',
	GET_DEX_ROUTERS_BY_CHAIN = 'get-dex-routers-by-chain',
	GET_TRADING_CONTRACTS = 'get-trading-contracts',
	GET_WALLET = 'get-wallet',
	GET_BALANCE = 'get-balance',
	GET_ERC20_BALANCE = 'get-erc20-balance',
	GET_SNIPES = 'get-snipes',
	GET_SNIPE_DATA = 'get-snipe-data',
}

export const getQueryKey = (key: QueryKey, variables?: Record<string, any>) => {
	const params: string[] = [];
	for (const v in variables) {
		params.push(`${v}=${variables[v]}`);
	}
	return `${key}?${params.join('&')}`;
};
