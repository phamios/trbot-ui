import Toasts from '@/components/bootstrap/Toasts';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

const useSuccessToast = () => {
	const { addToast } = useToasts();

	return useCallback((message: string) => {
		return addToast(
			<Toasts title="Success" icon="Info" iconColor="success" isDismiss>
				{message}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	}, []);
};

export default useSuccessToast;
