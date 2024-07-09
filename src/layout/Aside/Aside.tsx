import { pathToRoute } from '@/helpers';
import useMounted from '@/hooks/useMounted';
import { useRouter } from 'next/router';
import { FC, ReactNode, useMemo } from 'react';

interface IAsideHeadProps {
	children: ReactNode;
}
export const AsideHead: FC<IAsideHeadProps> = ({ children }) => {
	return <div className="aside-head">{children}</div>;
};

interface IAsideBodyProps {
	children: ReactNode;
}
export const AsideBody: FC<IAsideBodyProps> = ({ children }) => {
	return <div className="aside-body">{children}</div>;
};

interface IAsideFootProps {
	children: ReactNode;
}
export const AsideFoot: FC<IAsideFootProps> = ({ children }) => {
	return <div className="aside-foot">{children}</div>;
};

interface IAsideProps {
	children: any;
}

const WITHOUT_ASIDE_ROUTE_PATHS = ['login', '404'];

const Aside: FC<IAsideProps> = ({ children }) => {
	const { mounted } = useMounted();
	const router = useRouter();

	const isWithoutAside = useMemo(() => {
		return WITHOUT_ASIDE_ROUTE_PATHS.some((p) => p === pathToRoute(router.pathname));
	}, [router.pathname]);

	if (isWithoutAside) {
		return null;
	}

	return (
		<>
			<aside style={mounted ? { left: '0rem' } : undefined} className={'aside open'}>
				{children}
			</aside>
		</>
	);
};

export default Aside;
