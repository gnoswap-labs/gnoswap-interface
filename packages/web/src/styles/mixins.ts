import { css, SerializedStyles } from "@emotion/react";

export type MixinsKeyType =
  | "flexbox"
  | "positionCenter"
  | "posTopCenterRight"
  | "posTopCenterLeft"
  | "posMoveToTopAndLeft"
  | "posMoveToTopAndRight"
  | "useScrollStyle";

export type MixinsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in MixinsKeyType]: (...p: any[]) => SerializedStyles;
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
  positionCenter: () => css`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `,
  posTopCenterRight: (right = "0px") => css`
    position: absolute;
    top: 50%;
    right: ${right};
    transform: translateY(-50%);
  `,
  posTopCenterLeft: (left = "0px") => css`
    position: absolute;
    top: 50%;
    left: ${left};
    transform: translateY(-50%);
  `,
  posMoveToTopAndLeft: (top = "0px", left = "0px") => css`
    position: absolute;
    top: ${top};
    left: ${left};
  `,
  posMoveToTopAndRight: (top = "0px", right = "0px") => css`
    position: absolute;
    top: ${top};
    right: ${right};
  `,
  useScrollStyle: (thumbBackground: string) => css`
    &::-webkit-scrollbar {
      width: 8px;
      display: block;
      height: 0;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      padding: 0;
      height: 0;
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${thumbBackground};
      border-radius: 8px;
      padding: 0;
    }
  `,
} as const;

export default mixins;
