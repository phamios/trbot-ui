import Collapse from '@/components/bootstrap/Collapse';
import Icon from '@/components/icon/Icon';
import { pathRetouch } from '@/helpers';
import { TIcons } from '@/type/icon.type';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, forwardRef, HTMLAttributes, ReactNode, useCallback, useRef, useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import { useWindowSize } from 'react-use';

interface IListProps extends HTMLAttributes<HTMLUListElement> {
	id?: string;
	children?: ReactNode;
	className?: string;
	ariaLabelledby?: string;
	parentId?: string;
	rootId?: string;
	horizontal?: boolean;
}
export const List = forwardRef<HTMLUListElement, IListProps>(
	({ id, children, className, ariaLabelledby, parentId, rootId, horizontal, ...props }, ref) => {
		return (
			<ul
				ref={ref}
				id={id}
				className={classNames('navigation', { 'navigation-menu': horizontal }, className)}
				aria-labelledby={ariaLabelledby}
				data-bs-parent={
					parentId === `${rootId}__${rootId}` ? `#${rootId}` : (parentId && `#${parentId}`) || null
				}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			>
				{children}
			</ul>
		);
	},
);
List.displayName = 'List';

interface IItemProps {
	children?: ReactNode;
	to?: string;
	as?: string;
	title?: string;
	icon?: TIcons;
	id?: string;
	parentId?: string;
	rootId: string;
	isHorizontal?: boolean;
	notification?: boolean | string;
	isMore?: boolean;
	hide?: boolean;
	activeItem?: string;
	setActiveItem?(...args: unknown[]): unknown;
}
export const Item: FC<IItemProps> = ({
	children,
	to,
	as,
	title,
	icon,
	id,
	parentId,
	rootId,
	isHorizontal,
	notification,
	isMore,
	hide,
	...props
}) => {
	const { width } = useWindowSize();

	// eslint-disable-next-line react/prop-types
	const ACTIVE = props.activeItem === id;

	const handleClick = () => {
		if (typeof props.setActiveItem !== 'undefined') {
			ACTIVE ? props.setActiveItem(null) : props.setActiveItem(id);
		}
	};

	const ANCHOR_LINK_PATTERN = /^#/i;
	const router = useRouter();

	// For aside menu
	const here = typeof to === 'string' && to !== '/' && router.pathname.includes(to);
	// For top menu
	const match = to !== '/' && router.pathname === to;

	const LINK_CLASS = classNames('navigation-link', 'navigation-link-pill', {
		collapsed: !!children && !isHorizontal,
		active: isHorizontal ? match : here,
	});

	const INNER = (
		<>
			<span className="navigation-link-info">
				{icon && <Icon className="navigation-icon" icon={icon} />}
				{title && <span className="navigation-text">{title}</span>}
			</span>
			{(!!children || !!notification) && (
				<span className="navigation-link-extra">
					{!!notification && (
						<Icon
							icon="Circle"
							className={classNames(
								'navigation-notification',
								{
									[`text-${notification}`]: typeof notification === 'string',
									'text-danger': typeof notification !== 'string',
								},
								'animate__animated animate__heartBeat animate__infinite animate__slower',
							)}
						/>
					)}
					{!!children && <Icon className="navigation-arrow" icon="ChevronRight" />}
				</span>
			)}
		</>
	);

	const WITHOUT_CHILD =
		!children &&
		!hide &&
		((typeof to === 'string' && ANCHOR_LINK_PATTERN.test(to) && (
			<Link href={pathRetouch(to)} className={LINK_CLASS}>
				{INNER}
			</Link>
		)) || (
			<Link
				href={pathRetouch(to)}
				as={typeof as !== 'undefined' ? pathRetouch(as) : pathRetouch(to)}
				className={classNames(LINK_CLASS)}
			>
				{INNER}
			</Link>
		));

	// Dropdown
	const dropdownRef = useRef(null);

	const dropdownButtonRef = useRef(null);
	const setButtonRef = useCallback((node: null, ref: (arg0: any) => any) => {
		dropdownButtonRef.current = node;
		return ref(node);
	}, []);

	const dropdownListRef = useRef(null);
	const setListRef = useCallback((node: null, ref: (arg0: any) => any) => {
		dropdownListRef.current = node;
		return ref(node);
	}, []);

	const [dropdownStatus, setDropdownStatus] = useState(false);

	const dropdownButtonHandleClick = () => {
		setDropdownStatus(!dropdownStatus);
	};

	// Clicking outside to close
	const closeMenu = useCallback(() => {
		setDropdownStatus(false);
	}, []);

	if (children) {
		// submenu && in header
		if (isHorizontal) {
			return (
				<Manager>
					<li
						ref={dropdownRef}
						className={classNames('navigation-item', 'dropdown', {
							'navigation-item-more': isMore,
						})}
					>
						<Reference>
							{({ ref }) => (
								<span
									// @ts-ignore
									ref={(node) => setButtonRef(node, ref)}
									id={`${rootId}__${id}--link`}
									className={LINK_CLASS}
									// data-bs-toggle='dropdown'
									// data-bs-target={`#${rootId}__${id}`}
									aria-expanded={dropdownStatus}
									aria-controls={`${rootId}__${id}`}
									role="button"
									tabIndex={-1}
									onClick={dropdownButtonHandleClick}
									onKeyDown={dropdownButtonHandleClick}
								>
									{INNER}
								</span>
							)}
						</Reference>
						{dropdownStatus && (
							<Popper
								placement="bottom-start"
								modifiers={[
									{
										name: 'flip',
										options: {
											fallbackPlacements: [`bottom-end`, `bottom-start`],
										},
									},
								]}
							>
								{({ ref, style, placement }) => (
									<List
										// @ts-ignore
										ref={(node) => setListRef(node, ref)}
										style={style}
										data-placement={placement}
										id={`${rootId}__${id}`}
										className={classNames('dropdown-menu', 'show')}
										ariaLabelledby={`${rootId}__${id}--link`}
										rootId={rootId}
										parentId={`${rootId}__${parentId}`}
										onMouseLeave={() => setDropdownStatus(false)}
									>
										{children}
									</List>
								)}
							</Popper>
						)}
					</li>
				</Manager>
			);
		}
		// submenu && in aside
		return (
			<li className="navigation-item">
				<span
					id={`${rootId}__${id}--link`}
					className={LINK_CLASS}
					// data-bs-toggle='collapse'
					// data-bs-target={`#${rootId}__${id}`}
					aria-expanded={ACTIVE}
					aria-controls={`${rootId}__${id}`}
					role="button"
					tabIndex={-1}
					onClick={handleClick}
					onKeyDown={handleClick}
				>
					{INNER}
				</span>
				<Collapse isOpen={ACTIVE} isChildClone>
					<List
						id={`${rootId}__${id}`}
						ariaLabelledby={`${rootId}__${id}--link`}
						rootId={rootId}
						parentId={`${rootId}__${parentId}`}
						onMouseLeave={closeMenu}
					>
						{children}
					</List>
				</Collapse>
			</li>
		);
	}
	// without submenu
	return <li className="navigation-item">{WITHOUT_CHILD}</li>;
};

interface INavigationLineProps {
	className?: string;
}
export const NavigationLine: FC<INavigationLineProps> = ({ className }) => {
	return <hr className={classNames('navigation-line', className)} />;
};

interface INavigationTitleProps extends HTMLAttributes<HTMLSpanElement> {
	className?: string;
	children: ReactNode;
}
export const NavigationTitle: FC<INavigationTitleProps> = ({ className, children, ...props }) => {
	return (
		<li className="navigation-item">
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<span className={classNames('navigation-title', className)} {...props}>
				{children}
			</span>
		</li>
	);
};

interface INavigationProps {
	horizontal?: boolean;
	menu: {
		[key: string]: {
			id?: string | number;
			text?: string;
			path?: string;
			icon?: TIcons;
			isDisable?: boolean;
			subMenu?: {
				[key: string]: {
					id?: string | number;
					text?: string;
					path?: string;
					icon?: TIcons;
					isDisable?: boolean;
				};
			} | null;
		};
	};
	id: string;
	className?: string;
}

const Navigation = forwardRef<HTMLElement, INavigationProps>(({ menu, horizontal, id, className, ...props }, ref) => {
	const [activeItem, setActiveItem] = useState(undefined);

	function fillMenu(
		data:
			| {
					id?: string | number;
					text?: string;
					path?: string;
					icon?: TIcons;
					isDisable?: boolean;
					subMenu?:
						| {
								id?: string | number;
								text?: string;
								path?: string;
								icon?: TIcons;
								isDisable?: boolean;
						  }[]
						| undefined;
			  }[]
			| any,
		parentId: string,
		rootId: string,
		isHorizontal: boolean | undefined,
		isMore: boolean | undefined,
	) {
		return Object.keys(data).map((item) =>
			data[item].path ? (
				<Item
					key={data[item].id}
					rootId={rootId}
					id={data[item].id}
					title={data[item].text}
					icon={data[item].icon}
					to={data[item].path}
					as={data[item].as}
					parentId={parentId}
					isHorizontal={isHorizontal}
					setActiveItem={setActiveItem}
					activeItem={activeItem}
					notification={data[item].notification}
					hide={data[item].hide}
				>
					{!!data[item].subMenu &&
						fillMenu(data[item].subMenu, data[item].id, rootId, isHorizontal, undefined)}
				</Item>
			) : (
				!isMore && !isHorizontal && <NavigationTitle key={data[item].id}>{data[item].text}</NavigationTitle>
			),
		);
	}

	return (
		// @ts-ignore
		// eslint-disable-next-line react/jsx-props-no-spreading
		<nav ref={ref} aria-label={id} className={className} {...props}>
			<List id={id} horizontal={horizontal}>
				{fillMenu(menu, id, id, horizontal, undefined)}
				{horizontal && (
					<Item rootId={`other-${id}`} title={'More'} icon="MoreHoriz" isHorizontal isMore>
						{fillMenu(menu, `other-${id}`, `other-${id}`, false, true)}
					</Item>
				)}
			</List>
		</nav>
	);
});
Navigation.displayName = 'Navigation';

export default Navigation;
