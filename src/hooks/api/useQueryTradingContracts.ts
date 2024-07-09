import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { useQuery } from 'react-query';

const fetch = () => {
	return ServiceAPI.getTradingContracts();
};

const useQueryTradingContracts = () => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_TRADING_CONTRACTS),
		queryFn: fetch,
	});

	return response;
};

export default useQueryTradingContracts;
