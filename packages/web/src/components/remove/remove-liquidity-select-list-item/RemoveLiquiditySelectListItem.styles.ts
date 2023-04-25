import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/remove/remove-liquidity/RemoveLiquidity.styles";

export const wrapper = (checked: boolean) => (theme: Theme) =>
  css`
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    height: 56px;
    gap: 8px;
    background-color: ${theme.colors.opacityDark07};
    border: 1px solid ${checked ? theme.colors.gray40 : theme.colors.gray50};
    border-radius: 8px;
    padding: 15px;
    ${fonts.body12};
    color: ${theme.colors.gray20};
    transition: all 0.3s ease;

    input[type="checkbox"] + label:before {
      background-color: ${theme.colors.gray50};
    }

    .liquidity-value {
      margin-left: auto;
      color: ${theme.colors.gray10};
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
          fill: ${theme.colors.gray40};
        }
      }
    }
  `;
