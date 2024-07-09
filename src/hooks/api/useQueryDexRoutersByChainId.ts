import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { TDEXRouter } from '@/type/data/dex-routers.type';
import { isNaN, isNil } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

const fetch = (chainId: string) => {
	return ServiceAPI.getDexRoutersByChainId(chainId);
};

const useQueryDexRoutersByChainId = (chainId?: string, options?: UseQueryOptions<TDEXRouter[]>) => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_DEX_ROUTERS_BY_CHAIN, { chainId }),
		queryFn: fetch.bind(null, chainId as string),
		enabled: !isNil(chainId) && !isNaN(chainId),
		...(options || {}),
	});

	return response;
};

export default useQueryDexRoutersByChainId;
