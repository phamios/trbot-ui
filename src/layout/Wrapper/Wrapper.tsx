import React, { FC, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import Header from '../Header/Header';
import Content from '../Content/Content';
import { AuthContext } from '@/contexts/AuthContext';

interface IWrapperContainerProps {
	children: ReactNode;
	className?: string;
}
export const WrapperContainer: FC<IWrapperContainerProps> = ({ children, className, ...props }) => {
	return (
		<div
			className={classNames('wrapper', className)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{children}
		</div>
	);
};

interface IWrapper {
	children: ReactNode;
}
const Wrapper: FC<IWrapper> = ({ children }) => {
	const { isChecked } = useContext(AuthContext);

	if (!isChecked) {
		return <></>;
	}

	return (
		<>
			<WrapperContainer>
				{/* <Header /> */}
				<Content>{children}</Content>
			</WrapperContainer>
		</>
	);
};

export default Wrapper;
