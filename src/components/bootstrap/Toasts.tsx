import React, { Children, cloneElement, FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/Icon';
import { TIcons } from '@/type/icon.type';
import { TColor } from '@/type/color.type';

interface IToastHeaderProps {
	icon?: TIcons;
	iconColor?: TColor;
	title: ReactNode;
	time?: string | null;
	isDismiss?: boolean;
}
const ToastHeader: FC<IToastHeaderProps> = ({ icon, iconColor, title, time, isDismiss, ...props }) => {
	// @ts-ignore
	// eslint-disable-next-line react/prop-types
	const { onDismiss } = props;
	return (
		<div className="toast-header">
			{icon && <Icon icon={icon} size="lg" color={iconColor} className="me-2" />}
			{title && <strong className="me-auto">{title}</strong>}
			{time && <small>{time}</small>}
			{/* eslint-disable-next-line react/prop-types */}
			{isDismiss && onDismiss}
		</div>
	);
};

interface IToastBodyProps {
	children: ReactNode;
}
const ToastBody: FC<IToastBodyProps> = ({ children }) => {
	return <div className="toast-body">{children}</div>;
};

interface IToastProps {
	children: ReactNode;
	onDismiss(...args: unknown[]): unknown;
}
export const Toast: FC<IToastProps> = ({ children, onDismiss }) => {
	return (
		<div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
			{Children.map(children, (child, index) =>
				// @ts-ignore
				cloneElement(child, {
					// eslint-disable-next-line react/no-array-index-key
					key: index,
					onDismiss: <button type="button" className="btn-close" aria-label="Close" onClick={onDismiss} />,
				}),
			)}
		</div>
	);
};

interface IToastContainerProps {
	children?: ReactNode | undefined;
}

export const ToastContainer: FC<IToastContainerProps> = ({ children }) => {
	return <div className="toast-container position-fixed top-0 end-0 p-3">{children}</div>;
};

interface IToastsProps {
	title: ReactNode;
	children: ReactNode;
	icon?: TIcons;
	iconColor?: TColor;
	time?: string | null;
	isDismiss?: boolean;
}
const Toasts: FC<IToastsProps> = ({ icon, iconColor, title, time, isDismiss, children, ...props }) => {
	// @ts-ignore
	// eslint-disable-next-line react/prop-types
	const { onDismiss } = props;
	return (
		<>
			<ToastHeader
				icon={icon}
				iconColor={iconColor}
				title={title}
				time={time}
				isDismiss={isDismiss}
				// @ts-ignore
				onDismiss={onDismiss}
			/>
			<ToastBody>{children}</ToastBody>
		</>
	);
};

export default Toasts;
