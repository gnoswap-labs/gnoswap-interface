import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const cardStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body12};
  color: ${theme.color.text02};
  width: 100%;
  gap: 4px;
  padding: 24px 0px;
  &:first-of-type {
    border-bottom: 1px solid ${theme.color.border02};
  }
  .card-title {
    ${fonts.body9};
    color: ${theme.color.text01};
    width: 100%;
    padding: 0px 24px;
    margin-bottom: 20px;
  }
  .card-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 36px;
    padding: 0px 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: ${theme.color.background06};
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
    color: ${theme.color.text04};
    margin-right: auto;
  }
  .price {
    text-align: right;
  }
  .change {
    text-align: right;
    margin-left: 31px;
    color: ${theme.color.green01};
    &.negative {
      color: ${theme.color.red01};
    }
  }
`;
