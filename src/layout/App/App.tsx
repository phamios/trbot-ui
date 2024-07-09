import useMounted from '@/hooks/useMounted';
import { FC, ReactNode, useEffect } from 'react';

interface IAppProps {
	children: ReactNode;
}
const App: FC<IAppProps> = ({ children }) => {
	const { mounted } = useMounted();

	useEffect(() => {
		if (mounted) {
			var element = typeof document !== 'undefined' && document.getElementById('__next');
			if (element && 'classList' in element) {
				element?.classList.add('d-flex', 'flex-column', 'flex-grow-1', 'flex-shrink-1');
			}
		}
	}, [mounted]);

	return <div className="app">{children}</div>;
};

export default App;
