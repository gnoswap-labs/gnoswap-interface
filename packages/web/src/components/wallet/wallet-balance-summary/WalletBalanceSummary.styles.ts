import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const WalletBalanceSummaryWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 16px;
  padding: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${media.tablet} {
    padding: 36px 24px;
  }
  ${media.mobile} {
    padding: 12px;
  }
  .total-balance-title {
    ${fonts.body4};
    color: ${({ theme }) => theme.color.text05};
    ${media.tablet} {
      ${fonts.body6};
    }
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  .container {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 16px;
    ${media.mobile} {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
  .button-group {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    ${media.mobile} {
      width: 100%;
      flex-direction: column;
      align-items: center;
    }
    gap: 8px;
    .wallet-button-icon {
      ${mixins.flexbox("row", "center", "flex-start")};
      margin-right: 8px;
    }
  }
`;
