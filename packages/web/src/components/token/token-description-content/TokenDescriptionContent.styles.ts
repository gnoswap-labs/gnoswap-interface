import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  color: ${theme.colors.colorWhite};
  p {
    ${theme.fonts.body12};
    color: ${theme.colors.gray40};
    width: 100%;
    max-height: 180px;
    overflow: hidden;
    margin-bottom: 16px;
    &.auto-height {
      max-height: fit-content;
      overflow-y: visible;
    }
  }
`;
