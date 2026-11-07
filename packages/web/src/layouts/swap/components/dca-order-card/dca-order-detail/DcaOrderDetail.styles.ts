import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const DcaOrderDetailWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};

  .detail-header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 15px;
    gap: 8px;
    cursor: pointer;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text10};
    ${media.mobile} {
      padding: 11px;
      ${fonts.p2};
    }
    .rate-usd {
      color: ${({ theme }) => theme.color.text04};
    }
  }

  .gas-info {
    ${mixins.flexbox("row", "center", "flex-end")};
    flex-shrink: 0;
    gap: 4px;
    color: ${({ theme }) => theme.color.text04};
    .icon-arrow {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
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
