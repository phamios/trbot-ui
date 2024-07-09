import Icon from '@/components/icon/Icon';
import { managePagesMenu, toolPagesMenu } from '@/config/menu';
import classNames from 'classnames';
import Aside, { AsideBody, AsideFoot, AsideHead } from '../Aside/Aside';
import Brand from '../Brand/Brand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import UserAsideFoot from './UserAsideFoot';

const DefaultAside = () => {
	return (
		<Aside>
			<AsideHead>
				<Brand />
			</AsideHead>
			<AsideBody>
				<NavigationLine />
				<Navigation menu={toolPagesMenu} id="aside-tools" />
				<NavigationLine />
				<Navigation menu={managePagesMenu} id="aside-manage" />
			</AsideBody>
			<AsideFoot>
				<UserAsideFoot />
			</AsideFoot>
		</Aside>
	);
};

export default DefaultAside;
