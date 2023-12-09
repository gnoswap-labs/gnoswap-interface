import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TokenTradingModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 23px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 24px;
    .header {
      ${mixins.flexbox("row", "center", "flex-end")};
      width: 100%;
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
    }

    .content {
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 24px;
      .failed-logo {
        margin: auto;
        display: block;
      }
      h5 {
        ${fonts.body7}
        color: ${({ theme }) => theme.color.text02};
        text-align: center;
      }
      .des {
        margin-top: 8px;
        text-align: center;
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text04};
      }
      .link {
        ${mixins.flexbox("row", "center", "center")};
        gap: 8px;
        width: fit-content;
        margin: 0 auto;
        background-color: ${({ theme }) => theme.color.backgroundOpacity6};
        padding: 1.5px 8px;
        border-radius: 8px;

        > a {
          display: block;
          width: calc(100% - 44px);
          overflow: hidden;
          text-overflow: ellipsis;
          ${fonts.body12}
          color: ${({ theme }) => theme.color.text10};
          &:hover {
            color: ${({ theme }) => theme.color.hover06};
            ~ .new-tab *{
              fill: ${({ theme }) => theme.color.hover06};
            }
          }
        }
        svg {
          width: 14px;
          height: 14px;
          flex: 1 0 0;
          * {
            fill: ${({ theme }) => theme.color.icon16};
          }
        }
        .icon-copy {
          cursor: pointer;
          &:hover * {
            fill: ${({ theme }) => theme.color.icon17};
          }
        }
      }
      > div {
        width: 100%;
        .button-confirm {
          margin-bottom: 16px;
          gap: 8px;
          height: 57px;
          span {
            ${fonts.body7}
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
          }
        }
        
      }
    }

  }
  ${media.mobile} {
    padding: 15px 12px;
    width: 328px;
    .modal-body {
        .content {
            .failed-logo {
              width: 60px;
            }
            h5 {
              ${fonts.body9}
            }
            .des {
              ${fonts.p2}
            }
            .link {
              width: 100%;
              a {
                width: calc(100% - 44px);
              }
            }
            > div {
              .button-confirm {
                margin-bottom: 12px;
                height: 41px;
                span {
                  ${fonts.body9}
                }
              }
            }
          }
    }
  }
  
`;
