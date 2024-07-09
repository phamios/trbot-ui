import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { useQuery } from 'react-query';

const fetch = () => {
	return ServiceAPI.getDexRouters();
};

const useQueryDexRouters = () => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_DEX_ROUTERS),
		queryFn: fetch,
	});

	return response;
};

export default useQueryDexRouters;
