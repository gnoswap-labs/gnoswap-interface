import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

const orderBox = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};
`;

/** The market rate header, laid out like the Swap card's exchange rate, over the collapsible order details. */
export const DcaOrderDetailWrapper = styled(orderBox)`
  .detail-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 16px;
    gap: 8px;
    cursor: pointer;
    ${fonts.body12};
    ${media.mobile} {
      padding: 12px;
      ${fonts.p2};
    }
  }

  .rate-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    flex-wrap: wrap;
    min-width: 0;
    gap: 4px;
  }

  .rate {
    color: ${({ theme }) => theme.color.text10};
  }

  .rate-usd {
    color: ${({ theme }) => theme.color.text04};
  }

  .icon-arrow {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  .detail-body {
    width: 100%;
    padding: 15px;
    border-top: 1px solid ${({ theme }) => theme.color.border02};
    ${media.mobile} {
      padding: 11px;
    }
  }
`;

/** The order sentence and market price in their own box, as in the confirm modal. */
export const DcaOrderSentenceBox = styled(orderBox)`
  padding: 15px;
  ${media.mobile} {
    padding: 11px;
  }
`;
