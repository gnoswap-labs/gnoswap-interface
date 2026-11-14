import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const DcaOrderSentenceWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  min-width: 0;
  gap: 8px;

  .sentence {
    ${fonts.body12};
    line-height: 24px;
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p2};
      line-height: 20px;
    }
  }

  .token-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    vertical-align: bottom;
  }

  .market-price {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p2};
    }
  }

  .highlight {
    color: ${({ theme }) => theme.color.text10};
    white-space: nowrap;
  }
`;
