import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const LaunchpadWaitingConfirmationModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    padding: 24px;
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
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 24px;
      width: 100%;
      padding-bottom: 36px;
      .loading-section {
        ${mixins.flexbox("row", "center", "center")};
        width: 100%;
      }
      .text-section {
        ${mixins.flexbox("column", "center", "center")};
        gap: 8px;
        width: 100%;
        .title {
          color: ${({ theme }) => theme.color.text02};
          font-size: 18px;
          font-weight: 500;
        }
        .data {
          color: ${({ theme }) => theme.color.text02};
          font-size: 14px;
          font-weight: 400;
        }
        .description {
          color: ${({ theme }) => theme.color.border05};
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
`;
