import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const GovernanceAPRBreakdownWrapper = styled.div`
  ${mixins.flexbox("column", "stretch", "flex-start")};
  width: 100%;
  min-width: 0;
  gap: 8px;

  .apr-total {
    ${mixins.flexbox("row", "center", "flex-start")};
    align-self: flex-start;
    gap: 6px;
    font-variant-numeric: tabular-nums;
    @media (max-width: 968px) {
      align-self: flex-end;
    }
    ${media.mobile} {
      align-self: flex-start;
    }
  }

  .apr-unavailable {
    color: ${({ theme }) => theme.color.text04};
  }

  .apr-components {
    ${mixins.flexbox("row", "center", "flex-start")};
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    gap: 4px 12px;
  }

  .apr-component {
    ${mixins.flexbox("row", "baseline", "flex-start")};
    gap: 4px;
    min-width: 0;

    dt {
      ${mixins.flexbox("row", "baseline", "flex-start")};
      gap: 3px;
      white-space: nowrap;
    }
    dd {
      margin: 0;
      ${fonts.p3};
      color: ${({ theme }) => theme.color.text02};
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  .apr-component-label {
    ${fonts.p3};
    color: ${({ theme }) => theme.color.text04};
  }

  .apr-component-period {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }

  .apr-history-trigger {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    min-height: 28px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    font: inherit;
    background: none;
    color: inherit;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.color.text07};
      background: none;
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text07};
      outline-offset: 2px;
    }
  }

`;

export const GovernanceAPRHistoryPanel = styled.section`
  ${mixins.flexbox("column", "stretch", "flex-start")};
  width: min(340px, calc(100vw - 48px));
  gap: 8px;

  h3 {
    margin: 0;
    ${fonts.body11};
    color: ${({ theme }) => theme.color.text02};
  }

  .apr-disclosure {
    margin: 0;
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }
`;
