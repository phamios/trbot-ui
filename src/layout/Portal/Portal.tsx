import PropTypes from 'prop-types';
import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import useMounted from '../../hooks/useMounted';

interface IPortalProps {
	children: ReactNode;
	id?: string;
}
// @ts-ignore
const Portal: FC<IPortalProps> = ({ id, children }) => {
	const { mounted } = useMounted();

	const mount = typeof document !== 'undefined' && typeof id !== 'undefined' && document.getElementById(id);
	if (mounted) {
		if (mount) return ReactDOM.createPortal(children, mount);
	}
	return null;
};
Portal.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
};
Portal.defaultProps = {
	id: 'portal-root',
};

export default Portal;
