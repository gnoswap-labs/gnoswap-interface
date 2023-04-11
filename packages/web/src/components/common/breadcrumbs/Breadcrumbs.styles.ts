import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center", false)};
  ${theme.fonts.body12};
  height: 26px;
  padding: 0px 8px;
  background-color: ${theme.colors.gray60};
  color: ${theme.colors.gray40};
  border-radius: 2px;

  span {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${theme.colors.gray10};
    }
    &:last-of-type {
      color: ${theme.colors.gray30};
    }
  }

  .step-icon {
    width: 16px;
    height: 16px;
    margin: 0px 4px;
    * {
      fill: ${theme.colors.gray40};
    }
  }
`;
