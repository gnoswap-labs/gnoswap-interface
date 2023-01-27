import { css, FlattenSimpleInterpolation } from "styled-components";
import { fontWeight } from "../values/style-constant";

const desktopFont: FontsTypeByMedia = {
	h1: css`
		font-size: 40px;
		font-weight: ${fontWeight.BOLD};
	`,
	h2: css`
		font-size: 32px;
		font-weight: ${fontWeight.BOLD};
	`,
	h3: css`
		font-size: 28px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h4: css`
		font-size: 24px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h5: css`
		font-size: 20px;
		font-weight: ${fontWeight.MEDIUM};
	`,
} as const;

const tabletFont: FontsTypeByMedia = {
	h1: css`
		font-size: 32px;
		font-weight: ${fontWeight.BOLD};
	`,
	h2: css`
		font-size: 28px;
		font-weight: ${fontWeight.BOLD};
	`,
	h3: css`
		font-size: 24px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h4: css`
		font-size: 20px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h5: css`
		font-size: 16px;
		font-weight: ${fontWeight.MEDIUM};
	`,
} as const;

const mobileFont: FontsTypeByMedia = {
	h1: css`
		font-size: 20px;
		font-weight: ${fontWeight.BOLD};
	`,
	h2: css`
		font-size: 16px;
		font-weight: ${fontWeight.BOLD};
	`,
	h3: css`
		font-size: 14px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h4: css`
		font-size: 12px;
		font-weight: ${fontWeight.MEDIUM};
	`,
	h5: css`
		font-size: 11px;
		font-weight: ${fontWeight.MEDIUM};
	`,
} as const;

export type FontKeyType = "h1" | "h2" | "h3" | "h4" | "h5";

type FontsTypeByMedia = { [key in FontKeyType]: FlattenSimpleInterpolation };

export type FontsType = {
	desktopFont: FontsTypeByMedia;
	tabletFont: FontsTypeByMedia;
	mobileFont: FontsTypeByMedia;
};

export const fonts: FontsType = {
	desktopFont,
	tabletFont,
	mobileFont,
};
