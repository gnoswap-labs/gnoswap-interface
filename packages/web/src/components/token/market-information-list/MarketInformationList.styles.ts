import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 16px;
  .marketInfo-wrap {
    ${mixins.flexbox("column", "flex-start", "center")};
    ${fonts.body8};
    color: ${theme.color.text02};
    width: 100%;
    height: 91px;
    background-color: ${theme.color.background03};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 16px;
    gap: 16px;
    .title {
      ${fonts.body12};
      color: ${theme.color.text04};
    }
  }
`;
