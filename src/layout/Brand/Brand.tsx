import Icon from '@/components/icon/Icon';
import Link from 'next/link';
import { FC } from 'react';

interface IBrandProps {}
const Brand: FC<IBrandProps> = ({}) => {
	return (
		<div className="brand">
			<div className="brand-logo">
				<h1 className="brand-title ms-3">
					<Link href="#" aria-label="Logo">
						<Icon icon="Android" size="2x" />
						<span className="ms-3">BTP Bot</span>
					</Link>
				</h1>
			</div>
		</div>
	);
};

export default Brand;
