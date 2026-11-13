import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { OrderItemCardWrapper } from "./OrderItemCard.styles";

export const LimitOrderItemCardWrapper = styled(OrderItemCardWrapper)`
  .card-metrics {
    grid-template-columns: repeat(3, minmax(max-content, 1fr));
    overflow-x: auto;
  }

  .metric .metric-label {
    white-space: normal;
  }

  ${media.mobile} {
    .card-metrics .metric-value {
      ${fonts.p3};
    }

    .card-metrics .metric-annotation {
      ${fonts.p6};
    }
  }

  .metric-annotation {
    ${fonts.p2};
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
