import Collapse from '@/components/bootstrap/Collapse';
import Icon from '@/components/icon/Icon';
import classNames from 'classnames';
import { useContext, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { NavigationLine } from '../Navigation/Navigation';

const UserAsideFoot = () => {
	const { user, logout } = useContext(AuthContext);

	const [collapseStatus, setCollapseStatus] = useState<boolean>(false);

	if (!user) {
		return null;
	}

	return (
		<>
			<div
				className={classNames('user', { open: collapseStatus })}
				role="presentation"
				onClick={() => setCollapseStatus(!collapseStatus)}
			>
				<div className="user-info">
					<div className="user-name d-flex align-items-center">
						{`${user?.lastName} ${user?.firstName}`}
						<Icon icon="Verified" className="ms-1" color="info" />
					</div>
				</div>
			</div>

			<Collapse tag="div" isOpen={collapseStatus} className="user-menu">
				<nav aria-label="aside-bottom-user-menu-2">
					<div className="navigation">
						<div role="presentation" className="navigation-item cursor-pointer" onClick={logout}>
							<span className="navigation-link navigation-link-pill">
								<span className="navigation-link-info">
									<Icon icon="Logout" className="navigation-icon" />
									<span className="navigation-text">Logout</span>
								</span>
							</span>
						</div>
					</div>
				</nav>
			</Collapse>
		</>
	);
};

export default UserAsideFoot;
