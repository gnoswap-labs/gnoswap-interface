import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ConnectWalletModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 23px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 24px;
    .header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      > h6 {
        ${fonts.h6}
        color: ${({ theme }) => theme.color.text02};
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
      ${media.mobile} {
        > h6 {
          ${fonts.body9}
        }
      }
    }

    .content {
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 24px;

      .login-section {
        width: 100%;
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        gap: var(--login-section-gap, 24px);
      }

      .email-section {
        width: 100%;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid ${({ theme }) => (theme.themeKey === "dark" ? "#1C2230" : "#C3D2EA")};
        background-color: ${({ theme }) => (theme.themeKey === "dark" ? "#0A0E17" : "#C3D2EA")};

        &.error {
          border-color: ${({ theme }) => theme.color.red01};
        }

        > input {
          width: 100%;
          height: 100%;
          color: ${({ theme }) => theme.color.text01};
          &::placeholder {
            color: ${({ theme }) => theme.color.text05};
          }
        }
        > button {
          font-size: 0;
        }
        .right-chevron {
          * {
            fill: ${({ theme }) => theme.color.text05};
          }
        }

        ${media.mobile} {
          height: 50px;
        }
      }

      .validation-message {
        color: ${({ theme }) => theme.color.red01};
        font-weight: 500;
      }

      > div {
        width: 100%;
        .button-connect {
          gap: 8px;
          height: 57px;
          span {
            color: ${({ theme }) => theme.color.text01};
            ${fonts.body7}
          }
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
    }

    .footer {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
      a {
        color: ${({ theme }) => theme.color.background04};
        display: contents;
        ${fonts.body12};
        font-weight: 600;
        &:hover {
          color: ${({ theme }) => theme.color.background04Hover};
        }
      }
    }
  }
  .loading-button {
    width: 32px;
    height: 32px;
    background: conic-gradient(from 0deg at 50% 50.63%, #ffffff 0deg, #233dbd 360deg);
    &::before {
      width: 23.4px;
      height: 23.4px;
      background-color: ${({ theme }) => theme.color.background04Hover};
    }
  }
  ${media.mobile} {
    padding: 15px;
    width: 328px;
    .modal-body {
      gap: 12px;
      .content {
        gap: 16px;
        > div {
          .button-connect {
            height: 44px;
            span {
              ${fonts.body9}
            }
          }
        }
      }
    }
  }
`;
