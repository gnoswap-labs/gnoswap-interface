import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import iconChecked from "@components/common/icons/svg/icon-checked.svg";
import iconCheckboxBlank from "@components/common/icons/svg/icon-checkbox-blank.svg";
import iconCheckboxUnsure from "@components/common/icons/svg/icon-checkbox-unsure.svg";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  width: 500px;
  height: 100%;
  color: ${theme.color.text02};
  background-color: ${theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  box-shadow: ${theme.color.shadow01};
  padding: 23px;
  .title {
    ${fonts.h6};
  }
  .button-submit {
    height: 57px;
    span {
      font-size: 18px;
    }
    ${media.mobile} {
      height: 41px;
      span {
        font-size: 16px;
      }
    }
  }

  ${media.tabletMiddle} {
    max-width: 500px;
    width: 100%;
    padding: 23px;
    margin: auto;
    gap: 12px;
  }
  ${media.mobile} {
    padding: 15px;
  }
`;

export const inputStyle = (theme: Theme) => css`
  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] + label {
    ${mixins.flexbox("row", "center", "center")};
    &:before {
      ${mixins.flexbox("row", "center", "center")};
      cursor: pointer;
      content: "";
      width: 24px;
      height: 24px;
      mask-repeat: no-repeat;
      mask-position: center center;
      mask-size: contain;
      background-color: ${theme.color.text04};
      mask-image: url(${iconCheckboxBlank});
    }
  }

  input[type="checkbox"]:checked + label:before {
    background-color: ${theme.color.background04};
    mask-image: url(${iconChecked});
  }

  input[type="checkbox"]:disabled + label:before {
    background-color: ${theme.color.text04};
    mask-image: url(${iconCheckboxUnsure});
    cursor: default;
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