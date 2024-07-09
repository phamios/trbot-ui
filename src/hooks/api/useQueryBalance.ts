import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { TWalletBalance } from '@/type/data/wallets.type';
import { isNaN, isNil } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

const fetch = (chainId: string) => {
	return ServiceAPI.getBalance(chainId);
};

const useQueryBalance = (chainId?: string, options?: UseQueryOptions<TWalletBalance>) => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_BALANCE, { chainId }),
		queryFn: fetch.bind(null, chainId as string),
		enabled: !isNil(chainId) && !isNaN(chainId),
		...(options || {}),
	});

	return response;
};

export default useQueryBalance;
