import { css, keyframes, Theme } from "@emotion/react";
import { media } from "@styles/media";
import { CSSProperties } from "react";
import { ValuesType } from "utility-types";

const skeletonAni = keyframes`
  to {
    transform: translateX(100%);
  }
`;

const pulseAnim = keyframes`
    0% {
        opacity: 1
    }
    50% {
        opacity: 0.3;
    }
    100% {
        opacity: 1;
    }
`;

export interface PulseSkeletonParams {
  w?: CSSProperties["width"];
  h?: CSSProperties["height"];
  tabletWidth?: CSSProperties["width"];
  smallTableWidth?: CSSProperties["width"];
  mobileWidth?: CSSProperties["width"];
  type?: SHAPE_TYPES;
  tone?: "200" | "300" | "400" | "500" | "600";
}

const getPulseBackground = (
  tone: PulseSkeletonParams["tone"],
  theme: Theme,
) => {
  switch (tone) {
    case "200":
      return theme.color.skeleton02;
    case "300":
      return theme.color.skeleton03;
    case "400":
      theme.color.skeleton04;

    case "500":
      return theme.color.skeleton05;
    default:
      return theme.color.skeleton06;
  }
};

export const pulseSkeletonStyle =
  ({
    w = "100%",
    h = "18px",
    tone = "200",
    type = "rounded-square",
    tabletWidth,
    smallTableWidth,
    mobileWidth,
  }: PulseSkeletonParams) =>
  (theme: Theme) => {
    const width = typeof w === "number" ? `${w}px` : w;
    const height = typeof h === "number" ? `${h}px` : h;

    return css`
      position: relative;
      width: ${width};
      height: ${type === SHAPE_TYPES.CIRCLE ? `${width}px` : `${height}`};
      /* background: ${theme.color.background05}; */
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        width: 100%;
        height: 100%;
        background: ${getPulseBackground(tone, theme)};
        animation: 1.5s ease-in-out 0.5s infinite normal none running
          ${pulseAnim};
      }

      ${media.tablet} {
        width: ${tabletWidth ? `${tabletWidth}px` : tabletWidth};
        height: ${typeof height === "number" ? `${h}px` : h};
      }
      ${media.tabletMiddle} {
        width: ${smallTableWidth ? `${smallTableWidth}px` : smallTableWidth};
        height: ${typeof height === "number" ? `${h}px` : h};
      }
      ${media.mobile} {
        width: ${w};
        width: ${mobileWidth ? `${mobileWidth}px` : mobileWidth};
        height: ${typeof height === "number" && height === 22 ? "22px" : h};
      }
    `;
  };

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

export const skeletonTrendingStyle =
  (
    skeletonWidth: CSSProperties["width"],
    type: SHAPE_TYPES,
    seconds?: number,
  ) =>
  (theme: Theme) =>
    css`
      position: relative;
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: 25px;
      background: ${theme.color.background23};
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        transform: translateX(-100%);
        width: 100%;
        height: 100%;
        background: linear-gradient(
          0,
          ${theme.color.backgroundGradient} 0%,
          ${theme.color.backgroundGradient} 100%
        );
        animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
      }
    `;

export const skeletonTokenDetail =
  (
    skeletonWidth: CSSProperties["width"],
    type: SHAPE_TYPES,
    seconds?: number,
    tabletWidth?: CSSProperties["width"],
    smallTableWidth?: CSSProperties["width"],
  ) =>
  (theme: Theme) =>
    css`
      position: relative;
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: 22px;
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      z-index: 1;
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        transform: translateX(-100%);
        width: 100%;
        height: 100%;
        background: ${theme.color.backgroundGradient6};
        animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
      }
      ${media.tablet} {
        width: ${tabletWidth
          ? `${tabletWidth}px`
          : typeof skeletonWidth === "number"
          ? `${skeletonWidth}px`
          : skeletonWidth};
      }
      ${media.tabletMiddle} {
        width: ${smallTableWidth
          ? `${smallTableWidth}px`
          : typeof skeletonWidth === "number"
          ? `${skeletonWidth}px`
          : skeletonWidth};
      }
      ${media.mobile} {
        width: ${typeof skeletonWidth === "number"
          ? `${skeletonWidth}px`
          : skeletonWidth};
        height: 18px;
      }
    `;

export const skeletonTotalBalance =
  (
    skeletonWidth: CSSProperties["width"],
    type: SHAPE_TYPES,
    seconds?: number,
  ) =>
  (theme: Theme) =>
    css`
      position: relative;
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: 20px;
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      z-index: 1;
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        transform: translateX(-100%);
        width: 100%;
        height: 100%;
        background: ${theme.color.backgroundGradient6};
        animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
      }
      ${media.mobile} {
        height: 18px;
      }
    `;

export const skeletonBalanceDetail =
  (
    skeletonWidth: CSSProperties["width"],
    type: SHAPE_TYPES,
    seconds?: number,
  ) =>
  (theme: Theme) =>
    css`
      position: relative;
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: 20px;
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      z-index: 1;
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        transform: translateX(-100%);
        width: 100%;
        height: 100%;
        background: ${theme.color.backgroundGradient6};
        animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
      }
      ${media.mobile} {
        height: 18px;
      }
    `;

export const POOL_TD_WIDTH = [240, 190, 190, 190, 170, 180, 198];
export const POOL_TD_WIDTH_TABLET = [199, 150, 150, 150, 140, 150, 160];
export const POOL_TD_WIDTH_SMALL_TABLET = [185, 110, 110, 100, 80, 104, 160];
export const POOL_TD_WIDTH_MOBILE = [210, 110, 140, 120, 100, 106, 160];
export const TOKEN_SEARCH_WIDTH = [400];
export const ASSET_TD_WIDTH = [240, 300, 280, 280, 120, 138];
export const TABLET_ASSET_TD_WIDTH = [220, 240, 190, 190, 120, 138];
export const MOBILE_ASSET_TD_WIDTH = [230, 230, 195, 195, 90, 118];
export const TOKEN_TD_WIDTH = [
  56, 199, 105, 85, 85, 85, 140, 140, 138, 201, 124,
];
export const MOBILE_TOKEN_TD_WIDTH = [
  42, 90, 90, 85, 85, 85, 140, 140, 140, 190, 126,
];
export const MOBILE_ACTIVITY_TD_WIDTH = [210, 110, 140, 140, 160, 200];
export const ACTIVITY_TD_WIDTH = [240, 230, 230, 230, 230, 198];

export const LEADERBOARD_TD_WIDTH = [120, 400, 200, 200, 200, 240];
export const MOBILE_LEADERBOARD_TD_WIDTH = [50, 150, 128];
export const TABLET_LEADERBOARD_TD_WIDTH = [120, 300, 170, 170, 170, 170];

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
  LEADERBOARD_TABLE: "leaderboard-table",
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
    { width: 240, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 170, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 180, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 198, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const POOL_INFO_SMALL_TABLET = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  tdWidth: POOL_TD_WIDTH_SMALL_TABLET,
  list: [
    { width: 185, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 100, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.CIRCLE, left: false },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const POOL_INFO_TABLET = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  tdWidth: POOL_TD_WIDTH_TABLET,
  list: [
    { width: 199, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.CIRCLE, left: false },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const POOL_INFO_MOBILE = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  tdWidth: POOL_TD_WIDTH_MOBILE,
  list: [
    { width: 210, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 100, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 20, type: SHAPE_TYPES.CIRCLE, left: false },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const ASSET_INFO = {
  title: TABLE_TITLE.ASSET_TABLE,
  total: 15,
  tdWidth: ASSET_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
  ],
};

export const TOKEN_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 15,
  tdWidth: TOKEN_TD_WIDTH,
  list: [
    { width: 10, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, className: "" },
    {
      width: 199,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 105,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 140,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 140,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 138,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 201,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 124,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
  ],
};

export const LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    {
      width: 120 / 4,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "center",
    },
    {
      width: 400 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,

      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,

      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 240 / 3,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "padding-50",
    },
  ],
};

export const TABLET_LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    {
      width: 120 / 4,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "center",
    },
    {
      width: 300 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,

      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,

      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 3,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "padding-50",
    },
  ],
};

export const MOBILE_LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: MOBILE_LEADERBOARD_TD_WIDTH,
  list: [
    { width: 50 / 2, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    {
      width: 150,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "flex-grow start",
    },
    {
      width: 128,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
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
  tdWidth: ACTIVITY_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
  ],
};

export const LEADERBOARD_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false },
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
