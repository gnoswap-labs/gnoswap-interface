import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")};
  h3 {
    color: ${theme.colors.colorWhite};
    ${fonts.body11};
    margin-right: 12px;
  }
  button {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p4};
    gap: 4px;
    height: 24px;
    background-color: ${theme.colors.gray60};
    border-radius: 4px;
    padding: 0px 8px;
    color: ${theme.colors.gray30};
    margin-left: 4px;
    .link-icon {
      width: 16px;
      height: 16px;
      * {
        fill: ${theme.colors.gray40};
      }
    }
  }
  button:hover {
    color: ${theme.colors.gray20};
    transition: all 0.3s ease;
    .link-icon * {
      fill: ${theme.colors.gray20};
    }
  }
`;
