import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderListWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 11px;
  gap: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    padding: 8px;
    gap: 8px;
  }

  .order-list-title {
    ${fonts.p2};
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
    min-height: 160px;
    gap: 12px;
    padding: 24px 16px;
    text-align: center;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    .empty-icon {
      width: 32px;
      height: 32px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
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
