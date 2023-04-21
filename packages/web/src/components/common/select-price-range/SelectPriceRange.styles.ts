import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  background-color: ${theme.colors.opacityDark07};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray50};
  padding: 15px;
  gap: 16px;
  cursor: pointer;
  .title-content {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .title {
      color: ${theme.colors.gray30};
      ${fonts.body12};
    }
  }

  .select-price-wrap {
    ${mixins.flexbox("column", "center", "center")};
    gap: 8px;
    width: 100%;
  }

  .price-range-box {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 50px;
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: ${theme.colors.gray60};
      border: 1px solid ${theme.colors.gray40};
    }

    .item-title {
      color: ${theme.colors.gray10};
      ${fonts.body11};
    }
    .tooltip-wrap {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      & * {
        ${mixins.flexbox("row", "center", "center")};
      }
      .tooltip-icon {
        width: 100%;
        height: 100%;
        * {
          fill: ${theme.colors.gray01};
        }
      }
    }
  }

  .apr {
    color: ${theme.colors.gray10};
    ${fonts.body11};
    margin-left: auto;
  }
`;
