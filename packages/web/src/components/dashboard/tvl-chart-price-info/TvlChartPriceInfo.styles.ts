import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const TvlChartPriceInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  margin-bottom: 36px;
  .label {
    ${fonts.body4};
    color: ${({ theme }) => theme.color.text04};
  }
  .price {
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text01};
  }
`;
