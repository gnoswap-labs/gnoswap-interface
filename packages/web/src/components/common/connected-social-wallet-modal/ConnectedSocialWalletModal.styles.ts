import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const ConnectedSocialWalletModalWrapper = styled.div`
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
      }
      .detail {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 24px;

        width: 100%;
        .description {
          text-align: center;
          ${fonts.body12};
          color: ${({ theme }) => theme.color.text04};
        }
      }
      .link-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        .link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          width: fit-content;
          margin: 0 auto;
          background-color: ${({ theme }) => theme.color.backgroundOpacity6};
          padding: 1.5px 8px;
          border-radius: 8px;
          max-width: calc(100% - 44px);
          .url-wrapper {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            &:hover {
              > div {
                color: ${({ theme }) => theme.color.hover06};
              }
              .new-tab * {
                fill: ${({ theme }) => theme.color.hover06};
              }
            }
            div {
              width: calc(100% - 22px);
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              ${fonts.body12}
              color: ${({ theme }) => theme.color.text10};
            }
            ${media.mobile} {
              max-width: 100%;
            }
          }

          svg {
            width: 14px;
            height: 14px;
            flex: 1 0 0;
            * {
              fill: ${({ theme }) => theme.color.icon15};
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
        }
        .cancel-button {
          text-align: center;
          span {
            cursor: pointer;
            text-align: center;
            ${fonts.body11}
            color: ${({ theme }) => theme.color.text10};
            &:hover {
              color: ${({ theme }) => theme.color.text04};
            }
            ${media.mobile} {
              font-size: 14px;
            }
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
