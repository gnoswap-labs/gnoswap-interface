import { css, keyframes, Theme } from "@emotion/react";
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
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: ${type === SHAPE_TYPES.CIRCLE ? `${skeletonWidth}px` : "18px"};
      background: ${theme.color.background01};
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        transform: translateX(-50%);
        width: 100%;
        height: 100%;
        background: linear-gradient(
          0,
          ${theme.color.backgroundGradient} 0%,
          ${theme.color.backgroundGradient} 100%
        );
        animation: ${skeletonAni} 2s ease infinite;
      }
    `;

export const POOL_TD_WIDTH = [240, 190, 190, 190, 170, 180, 200];
export const TOKEN_SEARCH_WIDTH = [400];
export const ASSET_TD_WIDTH = [360, 360, 360, 140, 140];
export const TABLET_ASSET_TD_WIDTH = [273, 273, 273, 140, 140];
export const MOBILE_ASSET_TD_WIDTH = [150, 160, 90, 80, 120];
export const TOKEN_TD_WIDTH = [
  56, 203, 105, 85, 85, 85, 140, 140, 140, 195, 126,
];
export const MOBILE_TOKEN_TD_WIDTH = [
  42, 90, 90, 85, 85, 85, 140, 140, 140, 190, 126,
];
export const MOBILE_ACTIVITY_TD_WIDTH = [210, 110, 140, 140, 160, 200];
export const ACTIVITY_TD_WIDTH = [240, 230, 230, 230, 230, 200];

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
  ACTIVITY_TABLE: "activity-table",
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

export const MOBILE_TOKEN_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 15,
  tdWidth: MOBILE_TOKEN_TD_WIDTH,
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
export const TOKEN_SEARCH_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 3,
  tdWidth: TOKEN_SEARCH_WIDTH,
  list: [{ width: 400, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false }],
};
export const ACTIVITY_INFO = {
  title: TABLE_TITLE.ACTIVITY_TABLE,
  total: 15,
  tdWidth: TOKEN_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const MOBILE_ACTIVITY_INFO = {
  title: TABLE_TITLE.ACTIVITY_TABLE,
  total: 15,
  tdWidth: MOBILE_TOKEN_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};
