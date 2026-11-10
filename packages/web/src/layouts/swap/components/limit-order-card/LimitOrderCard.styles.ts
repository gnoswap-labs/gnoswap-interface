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
