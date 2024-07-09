import Toasts from '@/components/bootstrap/Toasts';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

const useErrorToast = () => {
	const { addToast } = useToasts();

	return useCallback((message: string) => {
		return addToast(
			<Toasts title="Error" icon="Error" iconColor="danger" isDismiss>
				{message}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	}, []);
};

export default useErrorToast;
