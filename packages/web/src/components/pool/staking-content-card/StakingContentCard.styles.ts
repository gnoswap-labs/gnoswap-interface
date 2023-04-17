import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (active: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox("column", "center", "space-between")};
    width: 100%;
    height: 100%;
    flex: 1;
    padding: 24px;
    color: ${theme.colors.gray10};
    background-color: ${active
      ? theme.colors.gray60
      : theme.colors.opacityDark05};

    border: ${active ? theme.colors.gray50 : theme.colors.gray60};
    border-radius: 8px;

    h5 {
      ${theme.fonts.body12};
      color: ${theme.colors.gray40};
    }

    .total-value {
      ${theme.fonts.body2};
      margin: 16px 0px;
    }

    .default-value {
      ${mixins.flexbox("row", "center", "center")};
      ${theme.fonts.body8};
      height: 41px;
      &.has-tooltip {
        cursor: pointer;
        transition: color 0.3s ease;
        &:hover {
          color: ${theme.colors.brand40};
        }
      }
    }

    .apr-value {
      ${theme.fonts.body4};
      color: ${theme.colors.gray30};
    }

    section {
      ${mixins.flexbox("column", "flex-start", "center")};
      gap: 4px;
    }

    .staking-info-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      background-color: ${theme.colors.opacityDark07};
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      width: 100%;
    }

    .staking-apr-wrap {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      height: 34px;
      gap: 16px;
    }

    .logo-images-wrap {
      ${mixins.flexbox("row", "center", "center", false)};
      height: 100%;
      img {
        width: 24px;
        height: 24px;
        &:not(:first-of-type) {
          margin-left: -6px;
        }
      }
    }
  `;
