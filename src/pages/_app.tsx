import '@/styles/styles.scss';

import { Toast, ToastContainer } from '@/components/bootstrap/Toasts';
import COLORS from '@/config/colors';
import AppContextProvider from '@/contexts';
import App from '@/layout/App/App';
import DefaultAside from '@/layout/DefaultAside/DefaultAside';
import Wrapper from '@/layout/Wrapper/Wrapper';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'react-jss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from 'react-toast-notifications';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const MainApp = ({ Component, pageProps }: AppProps) => {
	const theme = {
		theme: 'light',
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>
				<QueryClientProvider client={queryClient}>
					<AppContextProvider>
						<App>
							<DefaultAside />
							<Wrapper>
								<Component {...pageProps} />
							</Wrapper>
						</App>
					</AppContextProvider>
				</QueryClientProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default MainApp;
