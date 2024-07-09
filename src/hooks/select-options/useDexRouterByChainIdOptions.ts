import pascalcase from 'pascalcase';
import { useMemo } from 'react';
import useQueryDexRoutersByChainId from '../api/useQueryDexRoutersByChainId';

const useDexRouterByChainIdOptions = (chainId?: string) => {
	const { data } = useQueryDexRoutersByChainId(chainId);

	return useMemo(() => {
		console.log(data);
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

export default useDexRouterByChainIdOptions;
