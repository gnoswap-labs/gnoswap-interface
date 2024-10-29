import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const LaunchpadClaimAllModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  min-width: 328px;
  max-width: 500px;
  width: 90vw;
  gap: 16px;
  ${media.mobile} {
    width: 328px;
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    background-color: ${({ theme }) => theme.color.background06};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    box-shadow: ${({ theme }) => theme.color.shadow01};
    overflow: auto;
    width: 100%;
    gap: 16px;
    padding: 24px;
    ${media.mobile} {
      gap: 8px;
      padding: 12px;
    }
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

    .content-wrapper {
      padding: 12px 0;
      width: 100%;
      max-height: calc(80vh - 200px);
      overflow-y: auto;
      ${media.mobile} {
        padding: 0px;
      }
    }

    .content {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 2px;
      width: 100%;
      .data {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        gap: 8px;
        width: 100%;
        .data-box {
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          gap: 16px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid ${({ theme }) => theme.color.border02};
          background: ${({ theme }) =>
            theme.themeKey === "dark" ? theme.color.backgroundOpacity : ""};
          padding: 16px;
          .data-row {
            ${mixins.flexbox("row", "flex-start", "space-between")};
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            ${media.mobile} {
              font-size: 13px;
            }
            .key {
              color: ${({ theme }) => theme.color.text04};
            }
            .value {
              ${mixins.flexbox("row", "center", "center")};
              gap: 4px;
              color: ${({ theme }) => theme.color.text03};
            }
            .value .column {
              ${mixins.flexbox("column", "center", "flex-end")};
              color: ${({ theme }) => theme.color.text03};
            }
          }
        }
      }
    }

    .footer {
      width: 100%;
      button {
        height: 57px;
        ${media.mobile} {
          height: 41px;
        }
        span {
          font-size: 18px;
          font-weight: 500;
          ${media.mobile} {
            font-size: 16px;
          }
        }
      }
    }
  }
`;
