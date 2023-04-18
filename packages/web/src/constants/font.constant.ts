import { css, SerializedStyles } from "@emotion/react";
import { ValuesType } from "utility-types";

export const fonts = {
  h1: css`
    font-size: 60px;
    font-weight: 700;
    line-height: 72px;
  `,
  h2: css`
    font-size: 48px;
    font-weight: 600;
    line-height: 58px;
  `,
  h3: css`
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
  `,
  h4: css`
    font-size: 32px;
    font-weight: 600;
    line-height: 39px;
  `,
  h5: css`
    font-size: 24px;
    font-weight: 600;
    line-height: 29px;
  `,
  h6: css`
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
  `,
  body1: css`
    font-size: 28px;
    font-weight: 500;
    line-height: 39px;
  `,
  body2: css`
    font-size: 28px;
    font-weight: 400;
    line-height: 39px;
  `,
  body3: css`
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
  `,
  body4: css`
    font-size: 24px;
    font-weight: 400;
    line-height: 34px;
  `,
  body5: css`
    font-size: 22px;
    font-weight: 500;
    line-height: 31px;
  `,
  body6: css`
    font-size: 22px;
    font-weight: 400;
    line-height: 31px;
  `,
  body7: css`
    font-size: 18px;
    font-weight: 500;
    line-height: 25px;
  `,
  body8: css`
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
  `,
  body9: css`
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
  `,
  body10: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  `,
  body11: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
  `,
  body12: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
  `,
  p1: css`
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
  `,
  p2: css`
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
  `,
  p3: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
  `,
  p4: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
  `,
  p5: css`
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  `,
  p6: css`
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  `,
  p7: css`
    font-size: 9px;
    font-weight: 400;
    line-height: 11px;
  `,
} as const;

export type Fonts = ValuesType<typeof fonts>;
export type FontsKey = keyof typeof fonts;
