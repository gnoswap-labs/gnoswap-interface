import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const NoLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.backgroundOpacity9};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 43px 20px 48px 20px;
  .icon-no-position {
    width: 64px;
    height: 64px;
    ${media.mobile} {
      width: 50px;
      height: 50px;
    }
  }
  .description {
    margin-top: 18px;
    text-align: center;
    ${fonts.body8};
    line-height: 23px;
    color: ${({ theme }) => theme.color.text22};
    ${media.mobile} {
      margin-top: 14px;
      text-align: start;
      ${fonts.body12};
    }
  }
  ${media.mobile} {
    padding: 57px 12px 57px 12px;

  }
`;
