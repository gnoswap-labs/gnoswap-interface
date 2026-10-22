import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const ChartNavigation = styled.div`
  position: absolute;
  z-index: 3;
  left: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.color.border03};
    border-radius: 6px;
    background: ${({ theme }) => theme.color.background05};
    color: ${({ theme }) => theme.color.text02};
    cursor: pointer;
    pointer-events: auto;
    &::before {
      content: "";
      position: absolute;
      inset: -6px;
    }
    &:hover {
      color: ${({ theme }) => theme.color.text01};
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.text02};
      outline-offset: 2px;
    }
    span {
      display: flex;
      pointer-events: none;
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .price-chart-reset {
    path {
      fill: currentColor;
    }
  }
  .price-chart-latest {
    position: absolute;
    right: 0;
  }
  @media (hover: none), (pointer: coarse) {
    height: 28px;
    button {
      width: 28px;
      height: 28px;
      &::before {
        inset: auto;
        top: 50%;
        left: 50%;
        width: 44px;
        height: 44px;
        transform: translate(-50%, -50%);
      }
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

export const CandleTooltip = styled.div`
  ${fonts.body12}
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
  max-width: calc(100vw - 16px);
  max-height: calc(100dvh - 16px);
  overflow: hidden;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.color.border03};
  border-radius: 12px;
  background: ${({ theme }) => theme.color.background05};
  color: ${({ theme }) => theme.color.text04};
  box-shadow: 0 12px 28px rgb(0 0 0 / 24%);
  font-variant-numeric: tabular-nums;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    > span {
      flex-shrink: 0;
    }
  }
  .quote-volume {
    justify-content: flex-end;
  }
  strong {
    min-width: 0;
    color: ${({ theme }) => theme.color.text02};
    font-family: ui-monospace, monospace;
    font-weight: 500;
    text-align: right;
    overflow-wrap: anywhere;
  }
`;
