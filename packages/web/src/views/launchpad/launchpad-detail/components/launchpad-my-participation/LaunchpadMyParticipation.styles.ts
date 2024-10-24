import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const MyParticipationWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background06};
  padding: 24px;
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
    cursor: pointer;
    .title {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
      .icon-wrapper {
        ${mixins.flexbox("row", "center", "center")};
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
      &:hover {
        color: ${({ theme }) => theme.color.text03};

        * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
  }
`;
