import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export interface NotificationProps {
  width?: number;
}

export const NotificationListWrapper = styled.div<NotificationProps>`
  position: absolute;
  top: 44px;
  width: 320px;
  height: calc(100vh - 124px);
  overflow-y: auto;
  padding: 20px 0px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  right: ${({ width }) => {
    return width && width > 1920 ? "-250px" : width && width > 1440 ? `-${(width-1440)/2 + 10}px` : "-10px";
  }};
  left: ${({ width }) => {
    return width && width < 768 && "0px";
  }};
  ${media.tablet} {
    top: 42px;
    right: -10px;
    height: calc(100vh - 112px);
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: fixed;
    width: 100%;
    height: 426px;
    top: calc(100vh - 426px);
    z-index: ${Z_INDEX.modal};
    padding: 24px 0px;
    min-width: 360px;
  }
  .list-container {
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "flex-start")};
      width: 100%;
    }
    .list-content {
      ${media.mobile} {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        width: 100%;
      }
    }
  }
`;

export const NotificationHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  padding: 0px 24px 16px;
  ${media.mobile} {
    width: 100%;
    padding: 0px 12px 16px 12px;
  }
  .notification-title {
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text02};
  }
`;

export const ClearButton = styled.button`
  ${fonts.body11};
  color: ${({ theme }) => theme.color.text04};
`;

export const TxsListItem = styled.div`
  width: 100%;
  & + & {
    :before {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.color.background05};
      margin: 4px 0px;
    }
  }
`;

export const TxsDateAgoTitle = styled.span`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body11};
  color: ${({ theme }) => theme.color.text04};
  width: 100%;
  height: 34px;
  padding: 0px 24px;
  ${media.mobile} {
    padding: 0px 12px;
  }
`;

export const TxsSummaryItem = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  position: relative;
  width: 100%;
  min-height: 40px;
  padding: 8px 24px;
  height: auto;
  cursor: pointer;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  &:hover {
    background-color: ${({ theme }) => theme.color.hover02};
  }
  .summary-content {
    width: 100%;
    padding: 0px 10px 0px 44px;
  }
  .status-icon {
    margin-left: auto;
  }
  .success-icon * {
    fill: ${({ theme }) => theme.color.point};
  }
  .failed-icon * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  .pending-icon * {
    fill: ${({ theme }) => theme.color.icon06};
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
  ${fonts.body9};
  color: ${({ theme }) => theme.color.text04};
  padding: 0px 24px;
  width: 100%;
  height: 34px;
`;

export const TransactionItemsWrap = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  position: relative;

  width: 100%;
  cursor: pointer;
  padding: 0px 12px;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover02};
  }
  .list {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 8px 0px;
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text02};
      .content-wrap {
        ${mixins.flexbox("row", "center", "flex-start")};
        margin-left: 44px;
      }
    }
  }
  .success-icon * {
    fill: ${({ theme }) => theme.color.point};
  }
  .failed-icon * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  .pending-icon * {
    fill: ${({ theme }) => theme.color.icon06};
  }
  ${media.mobile} {
    margin-top: 4px;
  }
`;

export const DoubleLogo = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${mixins.posTopCenterLeft("12px")};
  border-radius: 50%;
  img {
    border-radius: 50%;
  }
  .right-logo {
    margin-left: -12px;
  }
`;
