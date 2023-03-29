import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  margin-top: 100px;
  h2 {
    ${theme.fonts.h5};
    color: ${theme.colors.gray10};
    margin-right: 36px;
  }
  .pools-search {
    margin-left: auto;
  }
`;
