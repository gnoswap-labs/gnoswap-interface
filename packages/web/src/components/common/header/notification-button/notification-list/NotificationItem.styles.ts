import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TxsListItem = styled.div`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 4px;
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
  padding: 16px 24px;
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
    color: ${({ theme }) => theme.color.text22};
    span.accent {
      color: ${({ theme }) => theme.color.text01};
      font-weight: 500;
    }
  }
  .status-icon {
    margin-left: 8px;
  }
  .success-icon * {
    fill: ${({ theme }) => theme.color.green01};
  }
  .failed-icon * {
    fill: ${({ theme }) => theme.color.red01};
  }
  .pending-icon * {
    fill: ${({ theme }) => theme.color.text24};
  }
`;

export const DoubleLogoDense = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${mixins.posTopCenterLeft("24px")};
  border-radius: 50%;
  img,
  div {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    aspect-ratio: 1/1;
  }
  .right-logo {
    margin-left: -12px;
  }

  .more-token {
    width: 15px;
    height: 15px;
    background: ${({ theme }) => theme.color.border02};
    border-radious: 8px;
    margin-left: -27px;
    margin-top: 9px;

    ${mixins.flexbox("row", "center", "center")};

    ${fonts.p7};
    font-size: 8px;
  }
`;

export const TransactionItemsWrap = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  position: relative;

  width: 100%;
  cursor: pointer;
  padding: 0px 12px;

  ${media.mobile} {
    margin-top: 4px;
    min-height: 40px;
  }
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
        margin-left: 44px;
        color: ${({ theme }) => theme.color.text22};
        span {
          color: ${({ theme }) => theme.color.text01};
        }
        ${media.mobile} {
        }
      }
    }
  }

  .status-icon {
    margin-left: 8px;
  }
  .success-icon * {
    fill: ${({ theme }) => theme.color.green01};
  }
  .failed-icon * {
    fill: ${({ theme }) => theme.color.red01};
  }
  .pending-icon * {
    fill: ${({ theme }) => theme.color.text24};
  }
`;

export const DoubleLogo = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${mixins.posTopCenterLeft("12px")};
  border-radius: 50%;
  img,
  div {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    aspect-ratio: 1/1;
  }
  .right-logo {
    margin-left: -12px;
  }

  .more-token {
    width: 15px;
    height: 15px;
    background: ${({ theme }) => theme.color.border02};
    border-radious: 8px;
    margin-left: -27px;
    margin-top: 9px;

    ${mixins.flexbox("row", "center", "center")};

    ${fonts.p7};
    font-size: 8px;
  }
`;
