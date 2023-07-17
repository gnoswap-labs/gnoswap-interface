import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (isStaked: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    height: 240px;
    background-color: ${isStaked
      ? theme.color.background09
      : theme.color.background03};
    border: 1px solid ${isStaked ? theme.color.border02 : theme.color.border01};
    border-radius: 10px;
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
    padding: 24px 36px;
    color: ${theme.color.text02};
    .pair-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      height: 36px;
    }
    .token-info {
      ${mixins.flexbox("row", "center", "center")};
    }
    .pair-symbol {
      ${fonts.body5};
      margin: 0px 8px;
    }

    .min-max-price {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 100%;
      margin: 8px 0px 16px;
      ${fonts.body12};
      color: ${theme.color.text05};
      span {
        color: ${theme.color.text04};
      }
    }

    .content-section {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
      section {
        ${mixins.flexbox("column", "flex-start", "center")};
        padding: 16px;
        flex: 1;
        gap: 24px;
        &:not(:first-of-type) {
          border-left: 1px solid ${theme.color.border02};
        }
      }
      h4 {
        ${fonts.body12}
        color: ${theme.color.text04};
      }
      .content-value {
        ${fonts.body2}
      }
    }
  `;
