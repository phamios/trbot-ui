import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { useQuery } from 'react-query';

const fetch = () => {
	return ServiceAPI.getDexes();
};

const useQueryDexes = () => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_DEXES),
		queryFn: fetch,
	});

	return response;
};

export default useQueryDexes;
