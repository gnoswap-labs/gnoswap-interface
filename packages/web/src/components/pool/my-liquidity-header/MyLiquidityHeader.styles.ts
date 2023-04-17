import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${theme.fonts.h5};
  color: ${theme.colors.gray10};
  .button-wrap {
    ${mixins.flexbox("row", "center", "center")};
    gap: 8px;
  }
`;
