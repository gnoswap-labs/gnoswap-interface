import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const WalletBalanceSummaryInfoWrapper = styled.div`
  ${mixins.flexbox("row", "baseline", "flex-start")};
  gap: 8px;
  ${media.mobile} {
    gap: 8px;
  }
  .amount {
    ${fonts.h3};
    color: ${({ theme }) => theme.color.text02};
    ${media.tablet} {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
  }
  .change-rate {
    ${fonts.body3};
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  .negative {
    ${fonts.body3};
    color: ${({ theme }) => theme.color.red01};
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  .positive {
    ${fonts.body3};
    color: ${({ theme }) => theme.color.green01};
    ${media.mobile} {
      ${fonts.body7};
    }
  }
`;
