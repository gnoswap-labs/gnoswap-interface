import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const TvlChartPriceInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  .label {
    ${fonts.body4};
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      font-size: 20px;
      font-weight: 500;
      line-height: 140%;
    }
  }
  .price {
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text01};
    ${media.mobile} {
      ${fonts.body5};
    }
  }
`;
