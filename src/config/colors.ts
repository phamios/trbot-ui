import { TColor } from '@/type/color.type';

export interface IColors {
	[key: string]: {
		name: TColor;
		code: string;
	};
}

const COLORS: IColors = {
	PRIMARY: {
		name: 'primary',
		code: String('#6c5dd3'),
	},
	SECONDARY: {
		name: 'secondary',
		code: String('#ffa2c0'),
	},
	SUCCESS: {
		name: 'success',
		code: String('#46bcaa'),
	},
	INFO: {
		name: 'info',
		code: String('#4d69fa'),
	},
	WARNING: {
		name: 'warning',
		code: String('#ffcf52'),
	},
	DANGER: {
		name: 'danger',
		code: String('#f35421'),
	},
	DARK: {
		name: 'dark',
		code: String('#1f2128'),
	},
	LIGHT: {
		name: 'light',
		code: String('#e7eef8'),
	},
};

export function getColorNameWithIndex(index: number) {
	return COLORS[Object.keys(COLORS)[index % (Object.keys(COLORS).length - 1)]]?.name;
}

export default COLORS;
