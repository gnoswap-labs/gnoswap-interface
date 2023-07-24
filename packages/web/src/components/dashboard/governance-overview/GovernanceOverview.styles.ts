import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const GovernanceOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  hegiht: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 24px;
  gap: 24px;
`;

export const GovernanceOverviewTitleWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body9};
  gap: 4px;
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin-top: 2.5px;
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const GovernanceWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  ${fonts.body7};
  gap: 16px;
  .total-issued,
  .holders,
  .passed-proposals,
  .active-proposals,
  .community-pool {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
  }

  .active-proposals-emissions-tooltip {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 4px;
  }

  .label-title {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    ${fonts.body10}
    color: ${({ theme }) => theme.color.text04};
    gap: 4px;
    svg {
      cursor: pointer;
      margin-top: 1.5px;
      width: 18px;
      height: 18px;
    }

    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;
