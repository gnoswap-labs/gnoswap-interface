import styled from "@emotion/styled";

import OrderInfoRows from "@components/order/order-info-rows/OrderInfoRows";
import { media } from "@styles/media";

export const LimitOrderInfoRows = styled(OrderInfoRows)`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};
  padding: 15px;

  ${media.mobile} {
    padding: 11px;
  }
`;

export const LimitOrderSideSelect = styled.div`
  width: 100%;
  margin-bottom: 8px;

  .select-tab-wrapper {
    width: 100%;
    align-items: stretch;
  }

  button {
    flex: 1;
    min-width: 0;
    min-height: 36px;
    padding: 6px 12px;
    white-space: normal;
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.border15};
      outline-offset: 2px;
    }

    ${media.mobile} {
      min-height: 44px;
    }
  }
`;
