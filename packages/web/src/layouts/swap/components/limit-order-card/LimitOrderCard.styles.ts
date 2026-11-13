import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
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
    padding: 4px;
    border-radius: 8px;
  }

  button {
    flex: 1;
    min-height: 40px;
    cursor: pointer;
    ${fonts.body10};

    &:disabled {
      cursor: default;
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.color.border15};
      outline-offset: 2px;
    }
  }
`;
