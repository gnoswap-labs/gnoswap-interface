import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export interface NotificationProps {
  width?: number;
  emptyData?: boolean;
}

export const NotificationListWrapper = styled.div<NotificationProps>`
  ${mixins.flexbox("column", "center", "flex-start")}
  position: absolute;
  top: 44px;
  width: 320px;
  height: calc(100vh - 124px);
  overflow-y: auto;
  padding: 19px 0px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: ${Z_INDEX.modal};
  right: ${({ width }) => {
    return width && width > 1920
      ? "-250px"
      : width && width > 1440
        ? `-${(width - 1440) / 2 + 10}px`
        : "-10px";
  }};
  left: ${({ width }) => {
    return width && width < 768 && "0px";
  }};
  ${media.tablet} {
    top: 42px;
    right: 0;
    height: calc(100vh - 112px);
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: fixed;
    width: 100%;
    height: ${({ emptyData }) => (emptyData ? "157px" : "426px")};
    top: calc(100% - ${({ emptyData }) => (emptyData ? "157px" : "426px")});
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
  &:hover {
    color: ${({ theme }) => theme.color.text03};
  }
  &:disabled {
    &:hover {
      cursor: not-allowed;
      ${({ theme }) => theme.color.text04};
    }
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const NoDataText = styled.span`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body11};
  flex: 1;
  color: ${({ theme }) => theme.color.text04};
  padding: 24px 24px;
  width: 100%;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${Z_INDEX.modalOverlay};
`;
