import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  ${fonts.body11};
  color: ${theme.colors.gray40};
  p {
    ${mixins.flexbox("row", "center", "center")};
  }
  .link-text {
    ${mixins.flexbox("row", "center", "center")};
    color: ${theme.colors.brand40};
    cursor: pointer;
    gap: 4px;
  }
  .link-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${theme.colors.gray40};
    }
  }
`;
