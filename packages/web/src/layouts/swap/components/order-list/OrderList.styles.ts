import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderListWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    padding: 12px;
    gap: 12px;
  }

  .order-list-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
  }

  .order-list-title {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .order-items {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 8px;
  }

  .order-empty {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    gap: 8px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background06};
    text-align: center;
    ${fonts.body10};
    color: ${({ theme }) => theme.color.text04};
    .empty-icon {
      width: 44px;
      height: 44px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
    .connect-wallet-text {
      /* Wraps after "wallet" as in the design; translations wrap by width. */
      max-width: 210px;
    }
  }

  .order-skeleton {
    width: 100%;
    height: 150px;
    border-radius: 8px;
  }

  .pagination {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
  }
`;
