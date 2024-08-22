import { css, type Theme } from "@emotion/react";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

import { inputStyle } from "../../StakePosition.styles";

export const wrapper = (theme: Theme) => css`
  ${inputStyle(theme)};
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 4px;
  .checked-all-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 32px;
    padding: 0px 15px;
    color: ${theme.color.text10};
    ${fonts.body12};
    .custom-label {
      margin-left: 8px;
    }
    .wrapper-check-label {
      ${mixins.flexbox("row", "center", "flex-start")}
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