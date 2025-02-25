import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SessionExpiredModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;

  width: 460px;
  padding: 23px;
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
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      gap: 24px;

      width: 100%;
      .warning-logo {
        margin: auto;
        display: block;
      }
      h5 {
        ${fonts.body7};
        color: ${({ theme }) => theme.color.text02};
        text-align: center;
        ${media.mobile} {
          font-size: 16px;
        }
      }
      .detail {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 8px;

        width: 100%;
        .description {
          text-align: center;
          ${fonts.body12};
          color: ${({ theme }) => theme.color.text04};
          ${media.mobile} {
            font-size: 13px;
            br {
              display: none;
            }
          }
        }
      }

      .button-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;

        width: 100%;
        button {
          height: 57px;
          span {
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
  }

  ${media.mobile} {
    padding: 12px;
    width: 328px;
    .modal-body {
      gap: 12px;
      .content {
        /* gap: 16px; */
        .button-wrapper {
          gap: 12px;
        }
      }
    }
  }
`;
