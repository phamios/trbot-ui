import { useMemo } from 'react';
import useQueryChains from '../api/useQueryChains';

const useChainOptions = () => {
	const { data } = useQueryChains();

	return useMemo(() => {
		if (!data) {
			return [];
		}
		return data.map((item) => {
			return {
				label: item.name,
				value: item.chainId,
			};
		});
	}, [data]);
};

export default useChainOptions;
