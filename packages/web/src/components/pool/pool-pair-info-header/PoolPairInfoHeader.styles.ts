import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")}
  width: 100%;
  height: 36px;
  h3 {
    ${theme.fonts.h5};
    color: ${theme.colors.gray10};
    margin: 0px 8px;
  }
  .badge-wrap {
    ${mixins.flexbox("row", "center", "center")}
    gap: 2px;
  }
`;
