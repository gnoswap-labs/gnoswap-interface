import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "space-between", "center")};
  ${fonts.body12};
  width: 100%;
  color: ${theme.color.text02};
  gap: 4px;
  .title-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    color: ${theme.color.text04};
    padding: 0px 24px;
  }
  .pair {
    width: 170px;
  }
  .tvl {
    width: 90px;
    margin-left: auto;
    margin-right: 31px;
  }
  .apr {
    width: 60px;
  }
  .tvl,
  .apr {
    text-align: right;
  }

  ul {
    ${mixins.flexbox("column", "space-between", "center")};
    gap: 4px;
    li {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 100%;
      height: 36px;
      padding: 0px 24px;
      transition: background-color 0.3s ease;
      cursor: pointer;
      &:hover {
        background-color: ${theme.color.background06};
      }
      .symbol {
        margin: 0px 8px;
      }
      .fee-rate {
        color: ${theme.color.text04};
      }
    }
  }
`;
