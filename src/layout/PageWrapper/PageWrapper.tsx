import Mounted from '@/components/Mounted';
import { AuthContext } from '@/contexts/AuthContext';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { forwardRef, ReactElement, useContext, useEffect } from 'react';
import { IPageProps } from '../Page/Page';

interface IPageWrapperProps {
	isProtected?: boolean;
	children: ReactElement<IPageProps> | ReactElement<IPageProps>[];
	className?: string;
}
const PageWrapper = forwardRef<HTMLDivElement, IPageWrapperProps>(({ isProtected, className, children }, ref) => {
	const { user } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (!user && isProtected) {
			router.push('/login');
		}
		return () => {};
	}, [user]);

	return (
		<div ref={ref} className={classNames('page-wrapper', 'container-fluid', className)}>
			<Mounted>{children}</Mounted>
		</div>
	);
});
PageWrapper.displayName = 'PageWrapper';
PageWrapper.propTypes = {
	isProtected: PropTypes.bool,
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
PageWrapper.defaultProps = {
	isProtected: true,
	className: undefined,
};

export default PageWrapper;
