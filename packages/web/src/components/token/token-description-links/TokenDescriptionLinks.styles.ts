import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")};
  h3 {
    color: ${theme.color.text01};
    ${fonts.body11};
    margin-right: 12px;
  }
  button {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p4};
    gap: 4px;
    height: 24px;
    background-color: ${theme.color.background06};
    border-radius: 4px;
    padding: 0px 8px;
    color: ${theme.color.text05};
    margin-left: 4px;
    .link-icon {
      width: 16px;
      height: 16px;
      * {
        fill: ${theme.color.icon03};
      }
    }
  }
  button:hover {
    color: ${theme.color.text03};
    transition: all 0.3s ease;
    .link-icon * {
      fill: ${theme.color.icon02};
    }
  }
`;
