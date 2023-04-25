import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (hasToken: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox("row", "center", "space-between")}
    height: 40px;
    width: 100%;
    background-color: ${theme.colors.gray50};
    border-radius: 36px;
    padding: ${hasToken ? "0px 6px" : "0px 6px 0px 12px"};
    cursor: pointer;
    span {
      ${fonts.body9};
      color: ${theme.colors.colorWhite};
      &.token-symbol {
        margin: 0px auto 0px 8px;
      }
    }
    .token-logo {
      width: 24px;
      height: 24px;
    }
    .arrow-icon {
      width: 16px;
      height: 16px;
    }
  `;
