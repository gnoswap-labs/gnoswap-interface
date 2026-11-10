import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

/** Frame shared by the order confirm modals, matching `ConfirmSwapModal`. */
export const OrderModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: relative;
  width: 460px;
  padding: 23px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);

  ${media.mobile} {
    width: 328px;
    padding: 15px;
    gap: 12px;
  }

  .modal-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    h6 {
      ${fonts.h6};
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.body9};
      }
    }
    .close-wrap {
      ${mixins.flexbox("row", "center", "center")};
      width: 24px;
      height: 24px;
      cursor: pointer;
      .close-icon * {
        fill: ${({ theme }) => theme.color.icon01};
      }
      .close-icon:hover * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }

  .section-title {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text10};
  }

  .modal-section-group {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 2px;
  }

  .modal-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    position: relative;
    width: 100%;
    padding: 15px;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background-color: ${({ theme }) => theme.color.background20};
    ${media.mobile} {
      padding: 11px;
    }
  }

  .modal-section-row {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;
  }

  .modal-split {
    ${mixins.flexbox("row", "stretch", "flex-start")};
    width: 100%;
    gap: 2px;
    /* Order fields align with the modal sections' padding. */
    & > * {
      padding: 15px;
      ${media.mobile} {
        padding: 11px;
      }
    }
  }

  .amount-text {
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text02};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${media.mobile} {
      ${fonts.body5};
    }
  }

  .sub-text {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .token-badge {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    gap: 8px;
    height: 34px;
    padding: 5px 12px 5px 6px;
    border-radius: 36px;
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background13};
  }

  .arrow {
    ${mixins.flexbox("row", "center", "center")};
    position: absolute;
    left: 50%;
    top: 100%;
    z-index: 1;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background-color: ${({ theme }) => theme.color.background01};
    .shape-icon * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }

  .notice-text {
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text04};
  }

  .button-confirm {
    width: 100%;
    height: 57px;
    span {
      ${fonts.body7};
    }
    ${media.mobile} {
      height: 41px;
      span {
        ${fonts.body9};
      }
    }
  }
`;
