import { shortAddress } from '@/helpers';
import React, { useMemo } from 'react';

interface EthereumAddressProps {
	shorten?: boolean;
	address?: string;
}

const EthereumAddress: React.FC<EthereumAddressProps> = ({ shorten, address }) => {
	const fullOrShortenAddress = useMemo(() => {
		if (address) {
			if (shorten) {
				return shortAddress(address);
			}
			return address;
		}
		return '';
	}, [address, shorten]);

	return <>{fullOrShortenAddress}</>;
};

export default EthereumAddress;
