import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  h2 {
    ${fonts.h5};
    color: ${theme.colors.gray10};
    margin-right: 36px;
  }
  .tokens-search {
    margin-left: auto;
  }
`;
