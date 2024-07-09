import { getQueryKey, QueryKey } from '@/config/query-keys';
import ServiceAPI from '@/services/service-api';
import { TSnipeData } from '@/type/data/snipes.type';
import { isNil } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

const fetch = (id: number) => {
	return ServiceAPI.getSnipeDataById(id);
};

const useQuerySnipes = (id?: number | null, options?: UseQueryOptions<TSnipeData>) => {
	const response = useQuery({
		queryKey: getQueryKey(QueryKey.GET_SNIPE_DATA),
		queryFn: fetch.bind(null, id as number),
		enabled: !isNil(id) && id > 0,
		...(options || {}),
	});

	return response;
};

export default useQuerySnipes;
