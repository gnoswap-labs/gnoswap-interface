import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const VolumeChartPriceInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  margin-bottom: 5px;
  .label {
    ${fonts.body4};
    color: ${({ theme }) => theme.color.text04};
  }
  .price {
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text01};
  }
`;

export const FeeInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: 100%;
  margin-bottom: 10px;
  ${fonts.body10};
  color: ${({ theme }) => theme.color.text04};
`;
