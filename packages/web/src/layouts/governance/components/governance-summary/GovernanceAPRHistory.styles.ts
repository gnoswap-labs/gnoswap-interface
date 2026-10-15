import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";

export const GovernanceAPRHistoryContent = styled.div`
  width: min(320px, calc(100vw - 56px));
  ${fonts.body12};

  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  th,
  td {
    padding: 7px 4px;
    white-space: nowrap;
  }

  th {
    color: ${({ theme }) => theme.color.text04};
    font-weight: 400;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.color.border01};
  }

  td {
    color: ${({ theme }) => theme.color.text01};
  }

  th:not(:first-of-type),
  td:not(:first-of-type) {
    text-align: right;
  }

  tbody tr:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.color.border01};
  }

  .estimate {
    display: block;
    color: ${({ theme }) => theme.color.text04};
    font-size: 11px;
  }
`;
