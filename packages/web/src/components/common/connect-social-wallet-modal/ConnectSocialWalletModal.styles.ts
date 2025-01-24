import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const ConnectSocialWalletModalWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  width: 460px;
  padding: 23px;
  gap: 16px;
  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 24px;
    width: 100%;
    .header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      .close-wrap {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
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
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 24px;
      .loading-spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .description {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        text-align: center;
        .title {
          color: ${({ theme }) => theme.color.text01};
          font-size: 18px;
          font-weight: 500;
          ${media.mobile} {
            font-size: 16px;
          }
        }
        .text {
          color: ${({ theme }) => theme.color.text04};
          font-size: 14px;
          font-weight: 400;
          ${media.mobile} {
            font-size: 13px;
          }
        }
      }
    }

    .cancel-button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      button {
        gap: 8px;
        height: 57px;
        span {
          color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text01 : theme.color.text09)};
          ${fonts.body7}
          ${media.mobile} {
            font-size: 16px;
          }
        }
        ${media.mobile} {
          height: 41px;
        }
      }
    }
  }
  ${media.mobile} {
    width: 328px;
    padding: 15px 11px;
  }
`;
