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
export const ChartControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  .chart-mode,
  .chart-intervals {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  button {
    min-width: 44px;
    min-height: 36px;
    padding: 6px 10px;
    border-radius: 4px;
    color: ${({ theme }) => theme.color.text04};
    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.color.text02};
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text02};
      outline-offset: 2px;
    }
    &[aria-pressed="true"] {
      background: ${({ theme }) => theme.color.background05};
      color: ${({ theme }) => theme.color.text02};
    }
  }
  ${media.mobile} {
    margin: 0;
    button {
      min-height: 44px;
    }
  }
`;

export const CandleChartWrapper = styled.div`
  .price-chart-shell {
    position: relative;
    width: 100%;
    height: 350px;
    background: ${({ theme }) => theme.color.background28};
    color: ${({ theme }) => theme.color.text04};
  }
  .price-chart-currency {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 11px;
    color: ${({ theme }) => theme.color.text04};
    pointer-events: none;
  }
  .price-chart-canvas {
    width: 100%;
    height: calc(100% - 40px);
  }
  .price-chart-status {
    position: absolute;
    inset: 0 0 40px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    text-align: center;
    background: ${({ theme }) => theme.color.background28};
    color: ${({ theme }) => theme.color.text02};
  }
  .price-chart-status button {
    text-decoration: underline;
    color: ${({ theme }) => theme.color.text02};
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text02};
    }
  }
  .price-chart-volume-label,
  .price-chart-attribution,
  .price-chart-paging {
    position: absolute;
    left: 12px;
    font-size: 11px;
    color: ${({ theme }) => theme.color.text04};
  }
  .price-chart-volume-label {
    bottom: 120px;
    pointer-events: none;
  }
  .price-chart-attribution {
    bottom: 4px;
    right: 8px;
    overflow-wrap: anywhere;
    text-decoration: underline;
  }
  .price-chart-paging {
    top: 8px;
    z-index: 3;
  }
  ${media.mobile} {
    .price-chart-shell {
      height: 300px;
    }
    .price-chart-attribution {
      font-size: 10px;
    }
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
      @media (min-width: 769px) {
        background-color: ${({ theme }) => theme.color.background15};
      }
    }
  }
  ${media.mobile} {
    height: 282px;
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
