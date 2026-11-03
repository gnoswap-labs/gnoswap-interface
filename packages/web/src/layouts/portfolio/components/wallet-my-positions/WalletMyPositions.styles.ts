import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const wrapper = () => css`
  ${mixins.flexbox("column", "center", "center")};
  gap: 24px;
`;

export const emptyPositions = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  min-height: 200px;
  gap: 16px;
  color: ${theme.color.text04};
  ${fonts.body8};
  svg {
    width: 48px;
    height: 48px;
  }
`;
