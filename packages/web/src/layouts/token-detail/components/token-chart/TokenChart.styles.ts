import styled from "@emotion/styled";
import { media } from "@styles/media";

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
    max-width: calc(100vw - 32px);
    border: none;
    padding: 0;
    gap: 16px;
  }
`;

export const ChartRegion = styled.div`
  display: flow-root;
  min-width: 0;
  background-color: ${({ theme }) => (theme.themeKey === "light" ? "transparent" : theme.color.background15)};
  border-radius: 8px;

  ${media.mobile} {
    width: 100%;
  }
`;

export const ChartControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 31px;
  width: fit-content;
  max-width: 100%;
  margin: 8px 0;
  gap: 0;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.background28};
  button {
    flex: 1;
    min-width: 50px;
    min-height: 0;
    height: 100%;
    padding: 0 8px;
    border-radius: 4px;
    color: ${({ theme }) => theme.color.text04};
    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.color.text02};
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text02};
      outline-offset: -2px;
    }
    &[aria-pressed="true"] {
      background: ${({ theme }) => theme.color.background05};
      color: ${({ theme }) => theme.color.text02};
    }
  }
  ${media.mobile} {
    height: 24px;
    width: 100%;
    max-width: none;
    margin: 8px 0;
    button {
      position: relative;
      min-width: 0;
      padding: 0;
      font-size: 12px;
      line-height: 18px;
      &::before {
        content: "";
        position: absolute;
        inset: -12px 0;
      }
    }
  }
`;

export const CandleChartWrapper = styled.div`
  .price-chart-shell {
    position: relative;
    width: 100%;
    height: 350px;
    background: ${({ theme }) => theme.color.background15};
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
    height: 100%;
  }
  .price-chart-status {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    gap: 8px;
    padding: 12px;
    text-align: center;
    background: ${({ theme }) => theme.color.background15};
    color: ${({ theme }) => theme.color.text02};
  }
  .price-chart-status button {
    min-width: 44px;
    min-height: 44px;
    padding: 8px;
    text-decoration: underline;
    color: ${({ theme }) => theme.color.text02};
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text02};
    }
  }
  .price-chart-paging {
    position: absolute;
    top: 8px;
    left: 12px;
    z-index: 3;
    font-size: 11px;
    color: ${({ theme }) => theme.color.text04};
  }
  .price-chart-paging-error {
    color: ${({ theme }) => theme.color.red01};
  }
  ${media.mobile} {
    .price-chart-shell {
      height: 300px;
    }
  }
`;
