import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

import { OrderItemCardWrapper } from "./OrderItemCard.styles";

/**
 * The DCA order card. Its status sits over a second line, the time left or the time it closed, instead of
 * lengthening the header; a status that no longer fits beside the pair wraps under it rather than pushing the
 * pair out of the card.
 */
export const DcaOrderItemCardWrapper = styled(OrderItemCardWrapper)`
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

  .card-status-time {
    ${mixins.flexbox("row", "center", "flex-end")};
    gap: 4px;
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text05};
    white-space: nowrap;
    .icon-clock {
      flex-shrink: 0;
      width: 12px;
      height: 12px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
`;
