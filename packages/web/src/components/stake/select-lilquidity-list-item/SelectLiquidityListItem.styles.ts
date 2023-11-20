import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/stake/stake-liquidity/StakeLiquidity.styles";
import { media } from "@styles/media";

export const wrapper = (checked: boolean) => (theme: Theme) =>
  css`
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    height: 56px;
    gap: 5px;
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
    .liquidity-value {
      margin-left: auto;
      color: ${theme.color.text02};
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
    > div:first-of-type {
      margin-left: 3px;
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
`;