import { useMemo } from 'react';
import useQueryDexes from '../api/useQueryDexes';

const useDexOptions = () => {
	const { data } = useQueryDexes();

	return useMemo(() => {
		if (!data) {
			return [];
		}
		return data.map((item) => {
			return {
				label: item.name,
				value: item.id,
			};
		});
	}, [data]);
};

export default useDexOptions;
