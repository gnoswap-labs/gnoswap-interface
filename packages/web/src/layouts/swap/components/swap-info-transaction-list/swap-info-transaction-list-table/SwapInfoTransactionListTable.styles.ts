import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";

export const TransactionListTableHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};
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
`;

export const TransactionListTableList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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
  padding: 12px 0;
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;

  ${fonts.body12};
  color: ${({ theme }) => theme.color.text01};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
`;

export const TokenPairWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

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
  }
`;
