import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")}
  ${theme.fonts.body11};
  color: ${theme.colors.gray40};
  margin: 0 auto;
  gap: 4px;
  width: 91px;
  .icon-load {
    width: 16px;
    height: 16px;
    * {
      fill: ${theme.colors.gray40};
    }
  }
`;
