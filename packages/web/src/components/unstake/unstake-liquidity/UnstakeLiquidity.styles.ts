import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import iconChecked from "@components/common/icons/svg/icon-checked.svg";
import iconCheckboxBlank from "@components/common/icons/svg/icon-checkbox-blank.svg";
import iconCheckboxUnsure from "@components/common/icons/svg/icon-checkbox-unsure.svg";
import { media } from "@styles/media";
import styled from "@emotion/styled";

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
  ${media.tabletMiddle} {
    margin: 0 auto;
    max-width: 500px;
    width: 100%;
  }
  ${media.mobile} {
    padding: 15px;
    gap: 12px;
  }
  .button-confirm {
    gap: 8px;
    height: 57px;
    span {
      ${fonts.body7}
    }
    ${media.mobile} {
      height: 41px;
      span {
        ${fonts.body9}
      }
    }
  }
`;

export const inputStyle = (theme: Theme) => css`
  .select-all-label {
    gap: 8px;
  }
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

export const StakeWarningContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start")};
  gap: 16px;

  .icon-link {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon21};
    }
  }
  a {
    ${mixins.flexbox("row", "center")};
    gap: 4px;
    font-weight: 600;
  }
`;