import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { Z_INDEX } from "@styles/zIndex";
import { media } from "@styles/media";

export const ConfirmSwapModalBackground = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  background: rgba(10, 14, 23, 0.7);
  z-index: ${Z_INDEX.modalOverlay};
`;

export const ConfirmModal = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  overflow: hidden;
  width: 460px;
  padding: 24px 0px;
  gap: 16px;
  top: calc(45vh - 230px);
  left: calc(50vw - 230px);
  border-radius: 8px;
  box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};

  ${media.mobile} {
    width: 328px;
    top: calc(40vh - 164px);
    left: calc(50vw - 164px);
    padding: 16px 0px;
  }

  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;

    ${media.mobile} {
      padding: 0px 12px;
    }

    .modal-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      span {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body7}
        font-weight: 600;
        ${media.mobile} {
          ${fonts.body9}
        }
      }

      .close-wrap {
        ${mixins.flexbox("row", "center", "center")};
        cursor: pointer;
        width: 24px;
        height: 24px;
        .close-icon {
          width: 24px;
          height: 24px;
          * {
            fill: ${({ theme }) => theme.color.icon01};
          }
        }
      }
    }

    .modal-receipt {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      gap: 2px;
      .input-group {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        width: 100%;
        gap: 2px;
        .first-section {
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          position: relative;
          width: 100%;
          padding: 16px;
          gap: 8px;
          border-radius: 8px;
          background: ${({ theme }) => theme.color.background01};
          border: 1px solid ${({ theme }) => theme.color.border02};
        }
        .second-section {
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          width: 100%;
          padding: 16px;
          gap: 8px;
          border-radius: 8px;
          background: ${({ theme }) => theme.color.background01};
          border: 1px solid ${({ theme }) => theme.color.border02};
        }
        .amount-container {
          ${mixins.flexbox("row", "center", "space-between")};
          width: 100%;
          align-self: stretch;
          color: ${({ theme }) => theme.color.text02};
          ${fonts.body1}
          ${media.mobile} {
            ${fonts.body5}
          }
        }
        .button-wrapper {
          ${mixins.flexbox("row", "center", "flex-start")};
          padding: 4px 12px 4px 6px;
          gap: 8px;
          border-radius: 36px;
          background: ${({ theme }) => theme.color.background13};
          ${fonts.body9}
          color: ${({ theme }) => theme.color.text02};
          .coin-logo {
            width: 24px;
            height: 24px;
          }
        }
        .amount-info {
          ${mixins.flexbox("row", "center", "flex-start")};
          .price-text {
            ${fonts.body12};
            color: ${({ theme }) => theme.color.text10};
            ${media.mobile} {
              ${fonts.p2};
            }
          }
        }
        .arrow {
          ${mixins.flexbox("row", "center", "center")};
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%, -50%);
          width: 100%;
          .shape {
            ${mixins.flexbox("row", "center", "center")};
            width: 40px;
            height: 40px;
            background-color: ${({ theme }) => theme.color.background01};
            border: 1px solid ${({ theme }) => theme.color.border02};
            border-radius: 50%;

            .shape-icon {
              width: 16px;
              height: 16px;
              * {
                fill: ${({ theme }) => theme.color.icon02};
              }
            }
          }
        }
      }
      .swap-info {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        width: 100%;
        padding: 16px;
        gap: 16px;
        ${media.mobile} {
          padding: 12px;
        }
        border-radius: 8px;
        background: ${({ theme }) => theme.color.background01};
        border: 1px solid ${({ theme }) => theme.color.border02};
        .ocin-info {
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 4px;
          .gnos-price {
            ${fonts.body12};
            ${media.mobile} {
              ${fonts.p2};
            }
            color: ${({ theme }) => theme.color.text03};
          }
          .exchange-price {
            ${fonts.body12};
            color: ${({ theme }) => theme.color.text04};
          }
          .icon-info {
            width: 16px;
            height: 16px;
            * {
              fill: ${({ theme }) => theme.color.icon05};
            }
          }
        }
      }
      .gas-info {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        width: 100%;
        padding: 16px;
        gap: 16px;
        ${media.mobile} {
          padding: 12px;
          gap: 8px;
        }
        border-radius: 8px;
        background: ${({ theme }) => theme.color.background01};
        border: 1px solid ${({ theme }) => theme.color.border02};

        ${fonts.body12};
        ${media.mobile} {
          ${fonts.p2};
        }

        .gray-text {
          color: ${({ theme }) => theme.color.text04};
        }
        .white-text {
          color: ${({ theme }) => theme.color.text03};
        }
        .slippage,
        .received,
        .gas-fee,
        .price-impact {
          ${mixins.flexbox("row", "flex-start", "space-between")};
          width: 100%;
          align-self: stretch;
        }
      }
    }

    .modal-button {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
    }

    .animation {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      align-self: stretch;
      animation-logo {
        width: 72px;
        height: 72px;
        * {
          fill: ${({ theme }) => theme.color.point};
        }
      }
    }
    .transaction-state {
      ${mixins.flexbox("column", "center", "flex-start")};
      width: 100%;
      gap: 8px;
      .submitted {
        ${fonts.body7};
        color: ${({ theme }) => theme.color.text02};
      }
      .swap-message {
        ${fonts.body11};
        color: ${({ theme }) => theme.color.text02};
      }
      .view-transaction {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        align-self: stretch;
        ${fonts.body11};
        color: ${({ theme }) => theme.color.text04};
        .open-logo {
          width: 16px;
          height: 16px;
          cursor: pointer;
          * {
            fill: ${({ theme }) => theme.color.icon05};
          }
        }
      }
    }
    .close-button {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
    }
  }
`;

export const SwapDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;
