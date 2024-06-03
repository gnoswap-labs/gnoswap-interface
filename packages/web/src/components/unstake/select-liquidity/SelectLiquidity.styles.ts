import { css, type Theme } from "@emotion/react";
import { inputStyle } from "@components/unstake/unstake-liquidity/UnstakeLiquidity.styles";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  background-color: ${theme.color.backgroundOpacity};
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  gap: 4px;

  .checked-all-wrap {
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")}
    width: 100%;
    height: 32px;
    padding: 0px 15px;
    color: ${theme.color.text10};
    ${fonts.body12};
    .liquidity-label {
      width: 80px;
      text-align: right;
      margin-left: auto;
    }
    .custom-label {
      margin-left: 8px;
    }
    ${media.mobile} {
      padding: 0 11px;
    }
  }
  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
    width: 100%;
  }
  .no-position {
    ${mixins.flexbox("row", "center", "center")};
    height: 176px;
    margin-top: 12px;
    color: ${theme.color.text04};
    ${fonts.body12}
  }
`;

export const loadingWrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  height: 188px;
  border-radius: 8px;
  > span {
    color: ${theme.color.text04};
    ${fonts.body11}
    margin-top: 18px;
  }
  > div {
    width: 48px;
    height: 48px;
    &::before {
      background-color: ${theme.color.background01};
      width: 38px;
      height: 38px;
    }
  }
  ${media.mobile} {
    height: 177px;
  }
`;