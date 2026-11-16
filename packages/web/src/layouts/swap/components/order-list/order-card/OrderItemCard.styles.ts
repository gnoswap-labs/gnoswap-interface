import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderItemCardWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 15px;
  gap: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    padding: 11px;
    gap: 10px;
  }

  /* Active orders are outlined; past ones are not. */
  &.active {
    border-color: ${({ theme }) => theme.color.border15};
  }

  .card-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;
  }

  .card-status {
    ${mixins.flexbox("row", "center", "flex-end")};
    flex-shrink: 0;
    gap: 6px;
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text05};
    /* The status dot takes the status color: gray for past orders, green while ongoing. */
    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    &.ongoing {
      color: ${({ theme }) => theme.color.green01};
    }
  }

  .card-metrics {
    display: grid;
    /* Every value stays on one line. */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) max-content;
    width: 100%;
    gap: 8px;
  }

  .metric {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    min-width: 0;
    gap: 4px;
    &:last-of-type {
      align-items: flex-end;
      text-align: right;
    }
    .metric-label {
      ${fonts.p2};
      color: ${({ theme }) => theme.color.text04};
      white-space: nowrap;
      ${media.mobile} {
        ${fonts.p3};
      }
    }
    .metric-value {
      ${mixins.flexbox("row", "center", "flex-start")};
      flex-wrap: nowrap;
      max-width: 100%;
      gap: 4px;
      ${fonts.body9};
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.body12};
      }
      .value-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .card-sub-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text04};
    .value {
      color: ${({ theme }) => theme.color.text02};
    }
  }

  .card-order-terms {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.color.border02};
    .card-sub-info {
      gap: 12px;
      align-items: flex-start;
      > span:first-child {
        min-width: 0;
      }
      .value {
        min-width: 0;
        max-width: 60%;
        text-align: right;
        overflow-wrap: anywhere;
      }
    }
  }

  .button-stop {
    height: 33px;
    span {
      ${fonts.p1};
    }
  }

  .history-toggle {
    ${mixins.flexbox("row", "center", "center")};
    align-self: center;
    gap: 4px;
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text05};
    cursor: pointer;
    .icon-arrow {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon05};
      }
    }
    &:hover {
      color: ${({ theme }) => theme.color.text02};
    }
  }
`;

export const OrderMetricTooltipContent = styled.div`
  ${fonts.p2};
  overflow-wrap: anywhere;
`;

/**
 * Metrics of a card that leads with prices: values keep their whole part and cut the fraction short (the tooltip
 * has the full value), with a muted annotation beside them, and fee rows show their USD value muted.
 */
export const priceOrderCardStyles = (theme: Theme) => css`
  .card-metrics {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1.5fr);
  }

  .metric:nth-of-type(2) {
    align-items: center;
    text-align: center;
  }

  .metric .metric-label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-metrics .metric-value {
    ${fonts.p1};
    min-width: 0;
  }

  .card-metrics .value-text {
    display: flex;
    overflow: hidden;
    text-overflow: clip;
  }

  .value-whole,
  .value-suffix {
    flex-shrink: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value-suffix {
    white-space: pre;
  }

  .value-fraction {
    min-width: 1ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric-annotation {
    ${fonts.p4};
    color: ${theme.color.text04};
    flex-shrink: 0;
    white-space: nowrap;
  }

  .card-sub-info .value .value-usd {
    color: ${theme.color.text04};
  }
`;
