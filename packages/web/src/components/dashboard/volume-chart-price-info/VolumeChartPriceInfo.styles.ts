import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const VolumeChartPriceInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  margin-bottom: 5px;
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

export const FeeInfoWrapper = styled.span`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: 100%;
  margin-bottom: 10px;
  ${fonts.body10};
  ${media.mobile} {
    ${fonts.body12};
  }
  color: ${({ theme }) => theme.color.text04};
`;
