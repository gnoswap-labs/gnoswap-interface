import { css, keyframes, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { CSSProperties } from "react";
import { ValuesType } from "utility-types";

const skeletonAni = keyframes`
  to {
    transform: translateX(100%);
  }
`;

export const skeletonStyle =
  (skeletonWidth: CSSProperties["width"], type: SHAPE_TYPES) =>
  (theme: Theme) =>
    css`
      position: relative;
      width: ${`${skeletonWidth}px`};
      height: ${type === SHAPE_TYPES.CIRCLE ? `${skeletonWidth}px` : "18px"};
      background: ${theme.colors.colorBlack};
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      &::after {
        content: "";
        ${mixins.posMoveToTopAndRight("0", "100%")}
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(20, 26, 41, 0.5) 0%,
          rgba(20, 26, 41, 0) 100.93%
        );
        animation: ${skeletonAni} 2s ease infinite;
      }
    `;

export const POOL_TD_WIDTH = [240, 230, 230, 230, 230, 200];
export const ASSET_TD_WIDTH = [360, 360, 360, 140, 140];
export const TOKEN_TD_WIDTH = [
  56, 203, 105, 85, 85, 85, 140, 140, 140, 195, 126,
];

export const SHAPE_TYPES = {
  CIRCLE: "circle",
  ROUNDED_SQUARE: "rounded-square",
  NONE: "none",
} as const;
export type SHAPE_TYPES = ValuesType<typeof SHAPE_TYPES>;

export const TABLE_TITLE = {
  POOL_TABLE: "pool-table",
  ASSET_TABLE: "asset-table",
  TOKEN_TABLE: "token-table",
};
export type TABLE_TITLE = ValuesType<typeof TABLE_TITLE>;

export const emptyArrayInit = (total: number) => {
  return [...new Array(total)].map((_, i) => i + 1);
};

export const POOL_INFO = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  tdWidth: POOL_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.CIRCLE, left: false },
  ],
};

export const ASSET_INFO = {
  title: TABLE_TITLE.ASSET_TABLE,
  total: 15,
  tdWidth: ASSET_TD_WIDTH,
  list: [
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
  ],
};

export const TOKEN_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 15,
  tdWidth: TOKEN_TD_WIDTH,
  list: [
    { width: 10, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 100, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 180, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};
