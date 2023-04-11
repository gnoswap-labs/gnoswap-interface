import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${theme.fonts.body7};
  width: 100%;
  color: ${theme.colors.colorWhite};
  gap: 24px;
  padding: 24px;
`;
