import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";

export const TransactionListTableHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};
  margin-bottom: 6px;
`;

export const TableHeader = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  @media screen and (max-width: 768px) {
    &.left {
      width: auto;
      flex: 1;
    }
    &:last-child {
      width: auto;
      flex: 2;
    }
  }
`;

export const TransactionListTableList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 4px;
`;

export const TransactionListTableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const TransactionListTableRowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 0;
  &.highlight {
    animation: shake 0.7s ease-in-out;
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    15% {
      transform: translateX(-5px);
    }
    30% {
      transform: translateX(5px);
    }
    45% {
      transform: translateX(-5px);
    }
    60% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;

  ${fonts.body12};
  color: ${({ theme }) => theme.color.text01};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  .path-link-icon {
    path {
      fill: ${({ theme }) => theme.color.text04};
    }
    &:hover {
      path {
        fill: ${({ theme }) => theme.color.text03};
      }
    }
  }

  @media screen and (max-width: 768px) {
    &.left {
      width: auto;
      flex: 1;
    }
    &:last-child {
      width: auto;
      flex: 2;
    }
  }
`;

export const TokenPairWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .token-amount {
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      font-size: 14px;
      color: ${({ theme }) => theme.color.text01};
    }
  }

  .arrow {
    width: 14px;
    height: 14px;
    * {
      fill: ${({ theme }) => (theme.themeKey === "dark" ? "#596782" : "#90a2c0")};
    }
  }
`;
