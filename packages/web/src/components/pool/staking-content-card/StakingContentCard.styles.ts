import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (active: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox("column", "center", "space-between")};
    width: 100%;
    height: 100%;
    flex: 1;
    padding: 24px;
    color: ${theme.color.text02};
    background-color: ${active
      ? theme.color.background09
      : theme.color.background03};

    border: ${active ? theme.color.border02 : theme.color.border01};
    border-radius: 8px;

    h5 {
      ${fonts.body12};
      color: ${theme.color.text04};
    }

    .total-value {
      ${fonts.body2};
      margin: 16px 0px;
    }

    .default-value {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.body8};
      height: 41px;
      &.has-tooltip {
        cursor: pointer;
        transition: color 0.3s ease;
        &:hover {
          color: ${theme.color.text07};
        }
      }
    }

    .apr-value {
      ${fonts.body4};
      color: ${theme.color.text05};
    }

    section {
      ${mixins.flexbox("column", "flex-start", "center")};
      gap: 4px;
    }

    .staking-info-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      background-color: ${theme.color.backgroundOpacity};
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
