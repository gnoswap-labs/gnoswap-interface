import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const PoolSelectionGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;

  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }

  svg {
    overflow: overlay;

    text {
      font-size: 12px;
      font-weight: 400;
      line-height: 15px;
      color: #e0e8f4;
    }

    .x-axis {
      color: ${({ theme }) => theme.color.border05};

      .tick {
        text {
          font-size: 9px;
          font-weight: 400;
          line-height: 11px;
          color: ${({ theme }) => theme.color.border05};
        }
      }
    }
  }

  .bar {
    stroke: ${({ theme }) => theme.color.background06};
    &.active {
      opacity: 0.4;
    }
  }

  .overlay {
    cursor: default;
    &:active {
      cursor: ew-resize;
    }
  }
  .selection {
    stroke: none;
    fill-opacity: 1;
  }
`;

export const PoolSelectionGraphTooltipWrapper = styled.div`
  padding: 0;
  pointer-events: none;
  border-radius: 8px;

  &.disabled {
    display: none;
  }

  .tooltip-wrapper {
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.color.background02};
    align-items: flex-start;
    border-radius: 8px;
    gap: 8px;
    ${fonts.body12};
    line-height: 1em;

    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 8px;
      & > span {
        display: flex;
        flex-direction: row;
        align-items: center;
        &.price-range {
          justify-content: flex-end;
        }
        &.token-title {
          ${media.mobile} {
            display: none;
          }
        }
      }
    }

    .header {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text04};
      justify-content: space-between;
      width: 100%;
      &.mt-8 {
        margin-top: 8px;
      }
      .row {
        padding: 3px 0;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text02};
      gap: 8px;
      width: 100%;
      .row {
        padding: 4px 0;
      }
      &:last-of-type {
        .token {
          ${media.mobile} {
            display: none;
          }
        }
      }
    }

    .token {
      flex-shrink: 0;
      min-width: 80px;
      gap: 8px;

      img {
        width: 20px;
        height: 20px;
      }
      ${media.mobile} {
        display: none;
      }
    }
    .amount {
      flex-shrink: 0;
      min-width: 80px;
      & .hidden {
        display: inline;
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
        word-break: break-all;
      }
      & .small-font {
        font-size: 12px;
      }
      &.w-100 {
        min-width: 108px;
      }
      img {
        width: 20px;
        height: 20px;
        display: none;
      }
      ${media.mobile} {
        &.total-amount {
          width: 85px;
          gap: 8px;
        }
        img {
          display: block;
        }
      }
    }

    .price-range {
      width: 100%;
    }
    .small-font {
      font-size: 12px;
    }
    ${media.mobile} {
      max-width: max-content;
    }
    @media (max-width: 360px) {
      max-width: 336px;
    }
  }
`;

export const EventBlocker = styled.div`
  position: absolute;
  top: 0;
  height: 0;
  width: 100%;
  height: 100%;
`;
