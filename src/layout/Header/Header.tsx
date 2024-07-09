import Mounted from '@/components/Mounted';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface IHeaderProps {
	children?: ReactNode;
}
const Header: FC<IHeaderProps> = ({ children }) => {
	return (
		<Mounted>
			<header className={classNames('header')}>
				<div className="container-fluid">
					<div className="row d-flex align-items-center">{children}</div>
				</div>
			</header>
		</Mounted>
	);
};

export default Header;
