import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const ConnectWalletStatusModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 23px;
  .modal-body {
    width: 100%;
    ${mixins.flexbox("column", "center", "flex-start")};
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
    .icon-wrapper {
      display: contents;
      .fail-icon {
        width: 72px;
        height: auto;
        ${media.mobile} {
          width: 60px;
        }
      }
    }
    .content {
      ${mixins.flexbox("column", "center", "center")};
      gap: 8px;
      h5 {
        ${fonts.body7}
        color: ${({ theme }) => theme.color.text02};
        ${media.mobile} {
          ${fonts.body9}
        }
      }
      div {
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text04};
        text-align: center;
        ${media.mobile} {
          ${fonts.p2}
        }
      }
    }
    .button-wrapper {
      width: 100%;
      .button-try {
        width: 100%;
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
    }
  }
  ${media.mobile} {
    width: 328px;
    padding: 15px 11px;
  }
`;
