import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  background-color: ${theme.color.backgroundOpacity};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  padding: 15px;
  gap: 16px;
  cursor: pointer;
  .title-content {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .title {
      color: ${theme.color.text05};
      ${fonts.body12};
    }
  }
  .select-fee-wrap {
    width: 100%;
    height: 103px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-gap: 4px;
    grid-template-columns: repeat(4, 1fr);
  }

  .fee-tier-box {
    ${mixins.flexbox("column", "center", "space-between")};
    width: 100%;
    height: 100%;
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 11px 7px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: ${theme.color.background06};
      border: 1px solid ${theme.color.border03};
    }
  }

  .fee-rate {
    color: ${theme.color.text02};
    ${fonts.body9};
  }
  .desc {
    ${fonts.p7};
    color: ${theme.color.text05};
    text-align: center;
    margin: 8px 0px;
  }
  .selected-fee-rate {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p6};
    color: ${theme.color.text03};
    background-color: ${theme.color.background02};
    border-radius: 25px;
    height: 20px;
    padding: 0px 8px;
  }
`;
