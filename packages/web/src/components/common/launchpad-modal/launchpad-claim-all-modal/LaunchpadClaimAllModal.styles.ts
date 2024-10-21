import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const LaunchpadClaimAllModalWrapper = styled.div`
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
        span {
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
  }
`;
