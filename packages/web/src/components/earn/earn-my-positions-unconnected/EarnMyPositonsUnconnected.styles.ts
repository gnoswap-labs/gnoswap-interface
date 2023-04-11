import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  ${theme.fonts.body10};
  width: 100%;
  color: ${theme.colors.gray30};
  background-color: ${theme.colors.gray60};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray50};
  height: 267px;
  .unconnected-icon {
    width: 48px;
    height: 48px;
    * {
      fill: ${theme.colors.gray40};
    }
  }
  p {
    text-align: center;
    margin: 24px 0px;
  }
`;
