import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/unstake/unstake-liquidity/UnstakeLiquidity.styles";

export const wrapper = (checked: boolean) => (theme: Theme) =>
  css`
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    height: 56px;
    gap: 8px;
    background-color: ${checked
      ? theme.color.background09
      : theme.color.backgroundOpacity};
    border: 1px solid ${checked ? theme.color.border03 : theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    ${fonts.body12};
    color: ${theme.color.text03};
    transition: all 0.3s ease;
    input[type="checkbox"] + label:before {
      background-color: ${theme.color.background02};
    }
    .period-value {
      color: ${theme.color.text02};
      width: 60px;
      text-align: right;
      margin-right: 62px;
      margin-left: auto;
    }
    .liquidity-value {
      color: ${theme.color.text02};
      width: 80px;
      text-align: right;
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
  `;
