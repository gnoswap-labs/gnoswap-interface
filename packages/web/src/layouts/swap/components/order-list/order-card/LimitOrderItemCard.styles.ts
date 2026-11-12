import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

import { OrderItemCardWrapper } from "./OrderItemCard.styles";

export const LimitOrderItemCardWrapper = styled(OrderItemCardWrapper)`
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
