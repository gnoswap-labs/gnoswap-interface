import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.body12};
  color: ${theme.color.text02};
  width: 100%;
  height: 36px;
  padding: 0px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${theme.color.background06};
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
