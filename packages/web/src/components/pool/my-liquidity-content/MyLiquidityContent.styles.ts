import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) =>
  css`
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    height: 121px;
    background-color: ${theme.colors.gray60};
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
    section {
      ${mixins.flexbox("column", "flex-start", "center")};
      padding: 24px 36px;
      height: 100%;
      flex: 1;
      gap: 16px;
      &:not(:first-of-type) {
        border-left: 1px solid ${theme.colors.gray50};
      }
    }

    h4 {
      ${theme.fonts.body12};
      color: ${theme.colors.gray40};
    }

    .has-tooltip {
      cursor: pointer;
      transition: color 0.3s ease;
      &:hover {
        color: ${theme.colors.brand40};
      }
    }

    span.content-value {
      ${theme.fonts.body2};
      color: ${theme.colors.gray10};
    }

    .claim-wrap {
      ${mixins.flexbox("row", "center", "space-between")}
      width: 100%;
    }
  `;
