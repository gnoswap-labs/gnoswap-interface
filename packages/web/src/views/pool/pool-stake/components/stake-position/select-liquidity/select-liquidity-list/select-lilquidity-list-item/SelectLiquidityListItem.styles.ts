import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { inputStyle } from "../../../StakePosition.styles";

export const wrapper = (checked: boolean) => (theme: Theme) =>
  css`
    position: relative;
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    width: 100%;
    height: 56px;
    background-color: ${theme.color.background20};
    border: 1px solid ${checked ? theme.color.border15 : theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    ${fonts.body12};
    color: ${theme.color.text03};
    transition: all 0.3s ease;
    input[type="checkbox"] + label:before {
      background-color: ${theme.color.background12};
    }
    .left-content {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 5px;
      > div:first-of-type {
        margin-left: 3px;
      }
    }
    .logo-wrapper {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 5px;
    }
    .liquidity-value {
      margin-left: auto;
      color: ${theme.color.text02};
    }
    .liquidity-value-fake {
      position: absolute;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      right: 0;
    }
    .hover-info {
      &,
      & * {
        width: 16px;
        height: 16px;
      }
      cursor: pointer;
      .icon-info {
        * {
          fill: ${theme.color.icon03};
        }
      }
    }
    .token-id {
      cursor: default;
    }

    ${media.mobile} {
      padding: 11px;
      height: 48px;
    }
  `;

export const tooltipWrapper = () => (theme: Theme) =>
  css`
  width: 268px;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  ${fonts.body12}
  > div {
    &:not(:first-of-type) {
      padding: 4px 0;
    }
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    .title {
      color: ${theme.color.text04};
    }
    .value {
      ${mixins.flexbox("row", "center", "center")};
      gap: 8px;
      color: ${theme.color.text02};
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .divider {
    width: 100%;
    height: 1px;
    border-top: 1px solid ${theme.color.border01};
    padding: 0 !important;
  }
  .unstake-description {
    color: ${theme.color.text04};
    padding: 0 !important;
    ${fonts.p4}
  }
`;

export const TokenValueWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
`;
export const TokenTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
`;