import { TColor } from '@/type/color.type';
import { TIcons, TIconsSize } from '@/type/icon.type';
import classNames from 'classnames';
import pascalcase from 'pascalcase';
import { forwardRef, HTMLAttributes, memo, ReactNode } from 'react';
import * as Material from './material-icons';
import * as SvgIcon from './svg-icons';

interface IRefWrapperProps extends Record<string, any> {
	children: ReactNode;
}
// @ts-ignore
const RefWrapper = forwardRef<HTMLSpanElement, IRefWrapperProps>(({ children }, ref) => {
	if (ref) {
		return (
			<span ref={ref} data-only-ref="true">
				{children}
			</span>
		);
	}
	return children;
});
RefWrapper.displayName = 'RefWrapper';

interface IIconProps extends HTMLAttributes<HTMLSpanElement> {
	icon?: TIcons;
	className?: string;
	color?: TColor;
	size?: TIconsSize;
	forceFamily?: null | 'custom' | 'material';
}

const Icon = forwardRef<HTMLSpanElement, IIconProps>(({ icon, className, color, size, forceFamily, ...props }, ref) => {
	const IconName = pascalcase(icon);

	// @ts-ignore
	// eslint-disable-next-line import/namespace
	const SvgIconWrapper = SvgIcon[IconName];
	// @ts-ignore
	// eslint-disable-next-line import/namespace
	const MaterialWrapper = Material[IconName];

	const ClassName = classNames('svg-icon', { [`svg-icon-${size}`]: size, [`text-${color}`]: color }, className);

	const isForceCustom = forceFamily === 'custom';
	const isForceMaterial = forceFamily === 'material';

	if (isForceCustom || (!isForceMaterial && typeof SvgIconWrapper === 'function')) {
		return (
			<RefWrapper ref={ref}>
				<SvgIconWrapper
					data-name={`SvgIcon--${IconName}`}
					className={classNames('svg-icon--custom', ClassName)}
					{...props}
				/>
			</RefWrapper>
		);
	}
	if (isForceMaterial || (!isForceCustom && typeof MaterialWrapper === 'function')) {
		return (
			<RefWrapper ref={ref}>
				<MaterialWrapper
					data-name={`Material--${icon}`}
					className={classNames('svg-icon--material', ClassName)}
					{...props}
				/>
			</RefWrapper>
		);
	}
	return null;
});
Icon.displayName = 'Icon';

export default memo(Icon);
