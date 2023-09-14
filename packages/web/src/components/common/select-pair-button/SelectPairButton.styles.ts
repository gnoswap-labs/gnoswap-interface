import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (hasToken: boolean, disabled?: boolean) => (
  theme: Theme,
) =>
  css`
    ${mixins.flexbox("row", "center", "space-between")}
    height: 100%;
    width: 100%;
    background-color: ${theme.color.background05};
    border-radius: 36px;
    padding: ${hasToken ? "0px 6px" : "0px 6px 0px 12px"};
    ${!disabled && "cursor: pointer;"};
    ${!disabled &&
    `
    transition: 0.2s;
    &:hover { background-color: ${theme.color.hover01}; }
    `};

    span {
      ${fonts.body9};
      color: ${theme.color.text01};
      &.token-symbol {
        margin: ${disabled ? "0px 8px" : "0px auto 0px 8px"};
      }
    }
    .token-logo {
      width: 24px;
      height: 24px;
    }
    .arrow-icon {
      width: 16px;
      height: 16px;
      * {
        fill: ${theme.color.icon01};
      }
    }
  `;
