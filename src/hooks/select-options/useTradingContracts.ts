import { useMemo } from 'react';
import useQueryTradingContracts from '../api/useQueryTradingContracts';

const useTradingContractOptions = () => {
	const { data } = useQueryTradingContracts();

	return useMemo(() => {
		if (!data) {
			return [];
		}
		return data.map((item) => {
			return {
				label: `${item.name} (${item.symbol}) - ${item.chain?.name}`,
				value: item.id,
			};
		});
	}, [data]);
};

export default useTradingContractOptions;
