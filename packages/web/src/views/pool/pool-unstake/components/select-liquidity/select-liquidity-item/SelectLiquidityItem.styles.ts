import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { inputStyle } from "@views/pool/pool-unstake/components/unstake-liquidity/UnstakeLiquidity.styles";
import { media } from "@styles/media";
import styled from "@emotion/styled";

export const wrapper = (checked: boolean) => (theme: Theme) =>
  css`
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 8px;
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
    }
    .period-value {
      color: ${theme.color.text02};
      width: 60px;
      text-align: right;
      margin-right: 62px;
      margin-left: auto;
    }
    .liquidity-value {
      margin-left: auto;
      color: ${theme.color.text02};
      text-align: right;
    }
    .logo-wrapper {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 5px;
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
    .img-logo {
      width: 24px;
      height: 24px;
    }
    label {
      margin-right: 3px;
    }
    .liquidity-value-fake {
      position: absolute;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      right: 0;
    }
    ${media.mobile} {
      padding: 11px;
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
  `;

export const TokenValueWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
`;
export const TokenTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
`;
