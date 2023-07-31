import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const SupplyOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  hegiht: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 24px;
  gap: 24px;
  .supply-overview {
    ${fonts.body9};
  }
`;

export const SupplyInfoWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")}
  width: 100%;
  ${fonts.body7};
  gap: 16px;
  .total-supply,
  .circulating-supply,
  .daily-block-emissions {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }
  .total-staked {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
  }

  .daily-block-emissions-tooltip {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    svg {
      cursor: pointer;
      margin: 3.5px 0px;
      width: 18px;
      height: 18px;
    }

    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  .label-title {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body10}
    color: ${({ theme }) => theme.color.text04};
    gap: 4px;
    svg {
      cursor: pointer;
      margin: 1.5px 0px;
      width: 18px;
      height: 18px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;

export const TotalStakedRatioWrapper = styled.div`
  ${mixins.flexbox("column", "flex-end", "flex-end")};
  gap: 4px;
  .staked-ratio-title {
    ${fonts.p2}
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const ProgressBar = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 12px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.color.background11};
  .progress-bar-rate {
    width: 245px;
    height: 12px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.point};
  }
`;
