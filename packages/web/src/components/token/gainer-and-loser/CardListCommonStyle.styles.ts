import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const cardStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${theme.fonts.body12};
  color: ${theme.colors.gray10};
  width: 100%;
  gap: 24px;
  padding: 24px 0px;
  &:first-of-type {
    border-bottom: 1px solid ${theme.colors.gray50};
  }
  .card-title {
    ${theme.fonts.body9};
    color: ${theme.colors.colorWhite};
    width: 100%;
    padding: 0px 24px;
  }
  .card-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 36px;
    padding: 0px 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: ${theme.colors.gray60};
    }
  }
  img {
    width: 20px;
    height: 20px;
  }
  .name {
    margin: 0px 8px;
  }
  .symbol {
    color: ${theme.colors.gray40};
    margin-right: auto;
  }
  .price {
    text-align: right;
  }
  .change {
    text-align: right;
    margin-left: 31px;
    color: ${theme.colors.colorGreen};
    &.negative {
      color: ${theme.colors.colorRed};
    }
  }
`;
