import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const OrderProgressBarWrapper = styled.div<{ progress: number }>`
  width: 100%;
  padding: 4px 0px;
  outline: none;

  .track {
    position: relative;
    width: 100%;
    height: 8px;
    overflow: hidden;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background12};
  }

  .bar {
    width: ${({ progress }) => `${progress}%`};
    min-width: ${({ progress }) => (progress > 0 ? "8px" : "0px")};
    height: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.point};
    transition: width 0.3s ease;
  }
`;

export const OrderOverviewTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  min-width: 220px;
  gap: 12px;
  ${fonts.body12};

  .overview-title {
    color: ${({ theme }) => theme.color.text02};
  }

  .overview-row {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 16px;
    .label {
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      color: ${({ theme }) => theme.color.text02};
    }
  }
`;
