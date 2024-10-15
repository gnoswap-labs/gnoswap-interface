import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const LaunchpadDepositModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    padding: 24px;
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
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 16px;
      width: 100%;
      .data {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        gap: 8px;
        width: 100%;
        .data-header {
          width: 100%;
          color: ${({ theme }) => theme.color.text05};
          font-size: 14px;
          font-weight: 400;
        }
        .data-box {
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          gap: 16px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid ${({ theme }) => theme.color.border02};
          background: ${({ theme }) => theme.color.backgroundOpacity};
          padding: 16px;
          .data-row {
            ${mixins.flexbox("row", "center", "space-between")};
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            .key {
              color: ${({ theme }) => theme.color.text04};
            }
            .value {
              ${mixins.flexbox("row", "center", "center")};
              gap: 4px;
              color: ${({ theme }) => theme.color.text03};
            }
          }
        }
      }

      .note {
        ${mixins.flexbox("column", "flex-start", "flex-start")}
        gap: 12px;
        width: 100%;
        border-radius: 8px;
        border: 1px solid rgba(255, 159, 10, 0.1);
        background: rgba(255, 159, 10, 0.08);
        padding: 16px;
        .header {
          ${mixins.flexbox("row", "center", "flex-start")}
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          /* color: ${({ theme }) => theme.color.text33}; */
          color: #ff9f0a;
        }
        .contents {
          ${mixins.flexbox("column", "cener", "center")};
          gap: 4px;
          width: 100%;
          .list {
            ${mixins.flexbox("row", "flex-start", "flex-start")};
            width: 100%;
            color: #ff9f0a;
            font-size: 14px;
            font-weight: 400;
            line-height: 18.2px;
            /* list-style-type: disc; */
            /* list-style-position: outside; */
            /* padding-left: 20px; */
          }
        }
        .learn-more {
          ${mixins.flexbox("row", "center", "flex-start")}
          gap: 4px;
          width: 100%;
          color: #ff9f0a;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .footer {
      width: 100%;
      button {
        height: 57px;
        span {
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
  }
`;
