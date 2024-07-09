import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { useQuery } from 'react-query';

const fetch = () => {
	return ServiceAPI.getChains();
};

const useQueryChains = () => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_CHAINS),
		queryFn: fetch,
	});

	return response;
};

export default useQueryChains;
