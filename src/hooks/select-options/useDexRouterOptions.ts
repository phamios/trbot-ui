import pascalcase from 'pascalcase';
import { useMemo } from 'react';
import useQueryDexRouters from '../api/useQueryDexRouters';

const useDexRouterOptions = () => {
	const { data } = useQueryDexRouters();

	return useMemo(() => {
		if (!data) {
			return [];
		}
		return data.map((item) => {
			return {
				label: `${item.name} - ${item.chain.name} - ${pascalcase(item.type)}`,
				value: item.id,
			};
		});
	}, [data]);
};

export default useDexRouterOptions;
