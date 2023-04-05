import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  color: ${theme.colors.gray10};
  ${theme.fonts.h5}
  height:36px;
`;
