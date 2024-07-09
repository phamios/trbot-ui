import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { TWalletBalance } from '@/type/data/wallets.type';
import { isNil } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

const fetch = (contractId: number) => {
	return ServiceAPI.getErc20Balance(contractId);
};

const useQueryErc20Balance = (contractId?: number, options?: UseQueryOptions<TWalletBalance>) => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_ERC20_BALANCE, { contractId }),
		queryFn: fetch.bind(null, contractId as number),
		enabled: !isNil(contractId) && contractId > 0,
		...(options || {}),
	});

	return response;
};

export default useQueryErc20Balance;
