import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";

export const GovernanceAPRHistoryContent = styled.div`
  width: 100%;
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
    text-align: left;
    font-weight: 400;
  }

  thead th {
    color: ${({ theme }) => theme.color.text04};
    border-bottom: 1px solid ${({ theme }) => theme.color.border01};
  }

  tbody th,
  td {
    color: ${({ theme }) => theme.color.text01};
  }

  th:not(:first-of-type),
  td {
    text-align: right;
  }

  tbody tr:not(:last-child) > * {
    border-bottom: 1px solid ${({ theme }) => theme.color.border01};
  }

  abbr {
    color: ${({ theme }) => theme.color.text04};
    text-decoration: none;
  }

  .estimate {
    display: block;
    color: ${({ theme }) => theme.color.text04};
    ${fonts.p4};
  }
`;
