import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (hasToken: boolean, disabled?: boolean, isHiddenArrow?: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox("row", "center", "space-between")}
    gap: 8px;
    height: 100%;
    width: 100%;
    background-color: ${theme.color.background13};
    border-radius: 36px;
    padding: ${hasToken ? "0px 6px" : "0px 6px 0px 12px"};
    ${!disabled && "cursor: pointer;"};
    ${!disabled &&
    `
        transition: 0.2s;
        &:hover { background-color: ${theme.color.backgroundGradient}; }
      `};
    > .token-info {
      ${mixins.flexbox("row", "center", "center")}
      gap: 8px;
      ${isHiddenArrow && "padding-right: 6px;"}
      &.isChanging {
        animation: fadeInOut 0.5s ease-in-out;
      }
    }
    span {
      ${fonts.body9};
      color: ${theme.color.text01};
      &.token-symbol {
        font-size: 16px;
      }
    }
    .token-logo {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .arrow-icon {
      width: 16px;
      height: 16px;
      * {
        fill: ${theme.color.icon01};
      }
    }
    .token-label-select {
      white-space: nowrap;
    }
    @keyframes fadeInOut {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `;
