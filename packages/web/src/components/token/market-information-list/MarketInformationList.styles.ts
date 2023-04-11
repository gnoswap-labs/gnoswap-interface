import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 16px;
  .marketInfo-wrap {
    ${mixins.flexbox("column", "flex-start", "center")};
    ${theme.fonts.body8};
    color: ${theme.colors.gray10};
    width: 100%;
    height: 91px;
    background-color: ${theme.colors.opacityDark05};
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
    padding: 16px;
    gap: 16px;
    .title {
      ${theme.fonts.body12};
      color: ${theme.colors.gray40};
    }
  }
`;
