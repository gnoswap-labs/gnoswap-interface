import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderHistoryTableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background20};
  overflow: hidden;

  .history-row {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr 1fr;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    gap: 8px;
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text02};
    border-bottom: 1px solid ${({ theme }) => theme.color.border02};
    ${media.mobile} {
      padding: 8px;
      gap: 4px;
      ${fonts.p3};
    }
    &:last-of-type {
      border-bottom: none;
    }
    &.history-header {
      color: ${({ theme }) => theme.color.text04};
    }
    &.highlight {
      animation: order-history-highlight 1s ease-in-out;
    }
  }

  @keyframes order-history-highlight {
    0% {
      background-color: ${({ theme }) => theme.color.backgroundOpacity};
    }
    100% {
      background-color: transparent;
    }
  }

  .cell {
    ${mixins.flexbox("row", "center", "flex-end")};
    min-width: 0;
    gap: 4px;
    white-space: nowrap;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.left {
      justify-content: flex-start;
    }
  }

  .cell .return {
    flex-shrink: 0;
    overflow: visible;
    color: ${({ theme }) => theme.color.green01};
    &.negative {
      color: ${({ theme }) => theme.color.red01};
    }
  }

  .time-link {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    .path-link-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    &:hover .path-link-icon * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }

  .pagination {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    padding: 8px 0px 12px;
  }
`;
