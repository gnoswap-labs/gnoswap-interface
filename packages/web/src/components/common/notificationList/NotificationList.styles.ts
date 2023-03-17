import styled from "@emotion/styled";
import mixins from "@/styles/mixins";

export const NotificationListWrapper = styled.div`
  ${mixins.posMoveToTopAndLeft("100%", "50%")};
  transform: translate(-50%, 8px);
  width: 320px;
  padding: 20px 0px;
  background-color: ${({ theme }) => theme.colors.gray60};
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

export const NotificationHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  padding: 0px 24px 16px;
  .notification-title {
    ${({ theme }) => theme.fonts.body9};
    color: ${({ theme }) => theme.colors.gray10};
  }
`;

export const ClearButton = styled.button`
  ${({ theme }) => theme.fonts.body11};
  color: ${({ theme }) => theme.colors.gray40};
`;

export const TxsListItem = styled.div`
  & + & {
    :before {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.colors.gray50};
      margin: 4px 0px;
    }
  }
`;

export const TxsDateAgoTitle = styled.span`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${({ theme }) => theme.fonts.body11};
  color: ${({ theme }) => theme.colors.gray40};
  width: 100%;
  height: 34px;
  padding: 0px 24px;
`;

export const TxsSummaryItem = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${({ theme }) => theme.fonts.body12};
  color: ${({ theme }) => theme.colors.gray10};
  position: relative;
  width: 100%;
  min-height: 40px;
  padding: 8px 24px;
  height: auto;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.colorBlack};
  }
  .summary-content {
    width: 100%;
    padding: 0px 10px 0px 44px;
  }
  .status-icon {
    margin-left: auto;
  }
  .success-icon * {
    fill: ${({ theme }) => theme.colors.colorPoint};
  }
  .failed-icon * {
    fill: ${({ theme }) => theme.colors.gray40};
  }
  .pending-icon * {
    fill: ${({ theme }) => theme.colors.brand40};
  }
`;

export const DoubleLogoWrapperTest = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${mixins.posTopCenterLeft("24px")};
  border-radius: 50%;
  img {
    border-radius: 50%;
  }
  .right-logo {
    margin-left: -12px;
  }
`;

export const NoDataText = styled.span`
  ${mixins.flexbox("row", "center", "center")};
  ${({ theme }) => theme.fonts.body9};
  color: ${({ theme }) => theme.colors.gray40};
  padding: 0px 24px;
  width: 100%;
  height: 34px;
`;
