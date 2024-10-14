import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const MyParticipationWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  gap: 16px;
  width: 100%;
  .my-participation-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .my-participation-title {
      color: ${({ theme }) => theme.color.text02};
      font-size: 18px;
      font-weight: 600;
    }
    .claim-all-button-wrapper {
      button {
        color: ${({ theme }) => theme.color.text02};
        padding: 10px 16px;
        height: 36px;
        span {
          font-size: 13px;
          font-weight: 500;
        }
      }
    }
  }

  .my-participation-box {
    ${mixins.flexbox("column", "center", "center")};
    gap: 16px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    background: ${({ theme }) => theme.color.backgroundOpacity};
    padding: 16px;
    .my-participation-box-header {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      width: 100%;
      .participation-box-index {
        color: ${({ theme }) => theme.color.text02};
        font-size: 22px;
        font-weight: 500;
      }
      .participation-box-chip {
        color: ${({ theme }) => theme.color.text06};
        padding: 4px 6px;
        font-size: 12px;
        font-weight: 400;
        border-radius: 4px;
        border: 1px solid ${({ theme }) => theme.color.border03};
        background: ${({ theme }) => theme.color.background03};
      }
    }
  }

  .participation-box-data-wrapper {
    ${mixins.flexbox("column", "center", "flex-start")};
    gap: 16px;
    width: 100%;
    .participation-box-data {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      .participation-box-data-key {
        color: ${({ theme }) => theme.color.text04};
        font-size: 14px;
        font-weight: 400;
      }
      .participation-box-data-value {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        color: ${({ theme }) => theme.color.text03};
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .participation-box-button-wrapper {
    width: 100%;
    button {
      height: 36px;
      padding: 10px 16px;
      span {
        font-size: 13px;
        font-weight: 500;
      }
    }
  }

  .box-accordion-button-wrapper {
    color: ${({ theme }) => theme.color.text05};
    font-size: 12px;
    font-weight: 400;
    button {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
    }
  }
`;
