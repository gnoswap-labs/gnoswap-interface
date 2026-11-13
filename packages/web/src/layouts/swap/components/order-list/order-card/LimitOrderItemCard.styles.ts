import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

import { OrderItemCardWrapper } from "./OrderItemCard.styles";

export const LimitOrderItemCardWrapper = styled(OrderItemCardWrapper)`
  .order-identity {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    min-width: 0;
    gap: 4px;
  }

  .order-side {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }

  .card-metrics {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1.5fr);
  }

  .metric .metric-label {
    white-space: normal;
  }

  .card-metrics .metric-value {
    ${fonts.body11};
    min-width: 0;
  }

  .card-metrics .value-text {
    display: flex;
    overflow: visible;
    text-overflow: clip;
  }

  .value-whole,
  .value-suffix {
    flex-shrink: 0;
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
    color: ${({ theme }) => theme.color.text04};
    flex-shrink: 0;
    white-space: nowrap;
  }

  .card-header {
    flex-wrap: wrap;
    row-gap: 4px;
  }

  .card-header > .card-status-group {
    margin-left: auto;
  }

  .card-status-group {
    ${mixins.flexbox("column", "flex-end", "flex-start")};
    flex-shrink: 0;
    gap: 2px;
  }

  .card-status {
    white-space: nowrap;
  }

  .card-status-time {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text05};
    white-space: nowrap;
  }

  .card-sub-info .value .value-usd {
    color: ${({ theme }) => theme.color.text04};
  }
`;
