import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TokenChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.text01};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  width: 100%;
  height: auto;
  padding: 23px;
  border-radius: 8px;
  ${media.mobile} {
    background-color: transparent;
    border: none;
    padding: 0;
    gap: 16px;
  }
  .chart-tab-wrapper {
  }

  .chart-graph-wrapper {
  }
`;


export const LoadingChart = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  height: 361px;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  > div {
    &::before {
      background-color: ${({ theme }) => theme.color.background01};
    }
    &::after {
      ${mixins.positionCenter()};
      content: "";
      border-radius: 50%;
      width: 60px;
      height: 60px;
      background-color: ${({ theme }) => theme.color.background15};
    }
  }
  ${media.mobile} {
    height: 252px;
  }
`;

export const ChartNotFound = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  height: 361px;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
  ${media.mobile} {
    height: 252px;
  }
`;
