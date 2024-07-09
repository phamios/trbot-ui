import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { TSnipe } from '@/type/data/snipes.type';
import { isNil } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

const fetch = (contractId: number) => {
	return ServiceAPI.getSnipesByContractId(contractId);
};

const useQuerySnipes = (contractId?: number, options?: UseQueryOptions<TSnipe[]>) => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_SNIPES),
		queryFn: fetch.bind(null, contractId as number),
		enabled: !isNil(contractId) && contractId > 0,
		...(options || {}),
	});

	return response;
};

export default useQuerySnipes;
