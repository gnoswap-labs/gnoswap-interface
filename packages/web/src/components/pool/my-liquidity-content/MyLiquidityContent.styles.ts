import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) =>
  css`
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    height: 121px;
    background-color: ${theme.color.background06};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    section {
      ${mixins.flexbox("column", "flex-start", "center")};
      padding: 24px 36px;
      height: 100%;
      flex: 1;
      gap: 16px;
      &:not(:first-of-type) {
        border-left: 1px solid ${theme.color.border02};
      }
    }

    h4 {
      ${fonts.body12};
      color: ${theme.color.text04};
    }

    .has-tooltip {
      cursor: pointer;
      transition: color 0.3s ease;
      &:hover {
        color: ${theme.color.text07};
      }
    }

    span.content-value {
      ${fonts.body2};
      color: ${theme.color.text02};
    }

    .claim-wrap {
      ${mixins.flexbox("row", "center", "space-between")}
      width: 100%;
    }
  `;
