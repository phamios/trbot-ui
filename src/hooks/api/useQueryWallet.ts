import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { useQuery } from 'react-query';

const fetch = () => {
	return ServiceAPI.getWallet();
};

const useQueryWallet = () => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_WALLET),
		queryFn: fetch,
	});

	return response;
};

export default useQueryWallet;
