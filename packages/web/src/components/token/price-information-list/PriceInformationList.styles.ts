import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  .information-wrap {
    ${mixins.flexbox("column", "flex-start", "center")};
    ${fonts.body8};
    color: ${theme.colors.colorGreen};
    width: 100%;
    height: 91px;
    background-color: ${theme.colors.opacityDark05};
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
    padding: 16px;
    gap: 16px;
    .title {
      ${fonts.body12};
      color: ${theme.colors.gray40};
    }
    .negative {
      color: ${theme.colors.colorRed};
    }
  }
`;
