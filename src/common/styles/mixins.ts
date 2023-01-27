import { css, CSSProp } from "styled-components";

export type MixinsKeyType =
	| "flexbox"
	| "positionCenter"
	| "posTopCenterRight"
	| "posTopCenterLeft"
	| "posMoveToTopAndLeft"
	| "posMoveToTopAndRight";

export type MixinsType = {
	[key in MixinsKeyType]: (...p: any[]) => CSSProp;
};

const mixins: MixinsType = {
	flexbox: (
		direction = "row",
		align = "center",
		justify = "center",
		display = true,
	) => css`
		display: ${display ? "flex" : "inline-flex"};
		flex-direction: ${direction};
		align-items: ${align};
		justify-content: ${justify};
	`,
	positionCenter: () => {
		return css`
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		`;
	},
	posTopCenterRight: (right = "0px") => {
		return css`
			position: absolute;
			top: 50%;
			right: ${right};
			transform: translateY(-50%);
		`;
	},
	posTopCenterLeft: (left = "0px") => {
		return css`
			position: absolute;
			top: 50%;
			left: ${left};
			transform: translateY(-50%);
		`;
	},
	posMoveToTopAndLeft: (top = "0px", left = "0px") => {
		return css`
			position: absolute;
			top: ${top};
			left: ${left};
		`;
	},
	posMoveToTopAndRight: (top = "0px", right = "0px") => {
		return css`
			position: absolute;
			top: ${top};
			right: ${right};
		`;
	},
} as const;

export default mixins;
