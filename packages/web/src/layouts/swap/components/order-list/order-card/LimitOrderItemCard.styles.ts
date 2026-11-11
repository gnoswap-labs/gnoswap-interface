import styled from "@emotion/styled";

import { OrderItemCardWrapper } from "./OrderItemCard.styles";

export const LimitOrderItemCardWrapper = styled(OrderItemCardWrapper)`
  .card-header {
    flex-wrap: wrap;
  }

  .card-status {
    margin-left: auto;
    white-space: nowrap;
  }
`;
