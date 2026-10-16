import { SelectTabWrapper } from "@components/common/select-tab-v2/SelectTabV2.styles";
import { fonts } from "@constants/font.constant";
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
  gap: 16px;
  ${media.mobile} {
    background-color: transparent;
    max-width: calc(100vw - 32px);
    border: none;
    padding: 0;
    gap: 16px;
  }
`;

export const ChartRegion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  width: 100%;
  gap: 12px;
`;

export const ChartControls = styled(SelectTabWrapper)`
  width: fit-content;
  max-width: 100%;
  border: none;

  button {
    ${fonts.body10};
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 0;
    width: 60px;
    height: 37px;
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
      background-color: ${({ theme }) => theme.color.select};
      color: ${({ theme }) => theme.color.text02};
    }
  }

  ${media.mobile} {
    width: 100%;
    button {
      ${fonts.body12};
      position: relative;
      height: 26px;
      padding: 4px 8px;
      &::before {
        content: "";
        position: absolute;
        inset: -9px 0;
      }
    }
  }
`;

export const CandleChartWrapper = styled.div`
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 8px;

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
