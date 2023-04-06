import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  color: ${theme.colors.gray10};
  ${theme.fonts.h5};
  gap: 24px;
  h2 {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
  }
`;
