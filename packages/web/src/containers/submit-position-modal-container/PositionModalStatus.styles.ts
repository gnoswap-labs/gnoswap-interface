import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { Z_INDEX } from "@styles/zIndex";
import { media } from "@styles/media";

export const PositionStatusBackground = styled.div`
  z-index: ${Z_INDEX.modal};
  position: fixed;
  overflow: scroll;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const ConfirmModal = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  /* pointer-events: initial; */
  /* overflow: hidden; */
  width: 460px;
  padding: 23px 0px;
  gap: 16px;
  border-radius: 8px;
  box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};

  &.modal-body-wrapper {
    gap: 24px;
    ${media.mobile} {
      padding: 12px 0px;
    }
  }
  ${media.mobile} {
    width: 328px;
    padding: 15px 0px;
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 23px;
    gap: 16px;
    ${media.mobile} {
      padding: 0px 15px;
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
          &:hover {
            * {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }
        }
      }
      &.model-header-submitted {
        ${mixins.flexbox("row", "center", "flex-end")};
      }
    }
    .modal-button {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      ${media.mobile} {
        height: 41px;
      }
    }
    .animation {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      align-self: stretch;
      .animation-logo {
        width: 72px;
        height: auto;
        ${media.mobile} {
          width: 60px;
          height: 54px;
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
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text02};
      }
      .view-transaction {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        align-self: stretch;
        ${fonts.body11};
        color: ${({ theme }) => theme.color.text04};
        span {
          text-align: center;
          br {
            display: none;
            ${media.mobile} {
              display: initial;
            }
          }
          .br {
            display: initial;
          }
        }
        .open-link {
          ${mixins.flexbox("row", "center", "center")};
          width: 16px;
          height: 16px;
        }
        .open-logo {
          width: 16px;
          height: 16px;
          cursor: pointer;
          * {
            fill: ${({ theme }) => theme.color.icon03};
          }
          &:hover {
            * {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }
        }
      }
    }
    .close-button {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      button {
        height: 57px;
      }
      ${media.mobile} {
        button {
          height: 41px;
          width: 304px;
        }
      }
    }
  }
  .submitted-modal {
    gap: 24px;
    ${media.mobile} {
      padding: 0 12px;
    }
  }
  .modal-body-loading {
    gap: 24px;
    .view-transaction {
      padding-bottom: 36px;
    }
    ${media.mobile} {
      gap: 12px;
      .view-transaction {
        padding-bottom: 12px;
      }
      .animation {
        .animation-logo {
          width: 60px;
          height: 60px;
        }
      }
  }
`;
