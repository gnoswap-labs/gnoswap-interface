import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const EarnAddLiquidityWrapper = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  color: ${({ theme }) => theme.color.text02};
  width: 500px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  padding: 23px;
  .button-submit {
    height: 57px;
    ${fonts.body7};
  }
  h3 {
    ${fonts.h6}
    ${media.mobile} {
      ${fonts.body9};
    }
  }
  .select-content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 4px;
    width: 100%;
  }

  .selector-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 15px;
    gap: 16px;

    .header-wrapper {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      height: 24px;
      cursor: pointer;
      &.default-cursor {
        cursor: default;
      }
      h5 {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text10};

      }
    }
    .fee-tier-bad {
      border: 1px solid #233DBD;
      color: ${({ theme }) => theme.color.text26};
      background: ${({ theme }) => theme.color.background22};
    }
  }

  .setting-button {
    width: 24px;
    height: 24px;

    .setting-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  ${media.mobile} {
    width: 100%;
    max-width: 500px;
    padding: 15px;
    .selector-wrapper {
      gap: 8px;
      padding: 11px;
    }
    .button-submit {
      height: 41px;
      ${fonts.body9};
    }
  }
`;
