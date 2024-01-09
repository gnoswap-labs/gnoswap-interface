import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const NoLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 20px 20px 30px 20px;
  .icon-no-position {
    width: 70px;
    height: 70px;
    ${media.mobile} {
      width: 50px;
      height: 50px;
    }
  }
  > p {
    margin-top: 19px;
    margin-bottom: 10px;
    font-size: 20px;
    line-height: 26px;
    font-weight: 500;
  }
  ${media.tablet} {
    padding: 25px 0 30px 20px;
    height: auto;
    ${fonts.h6};
    > p {
      font-size: 18px;
      line-height: 24px;
    }
  }
  ${media.mobile} {
    padding: 25px 12px;
    > p {
      ${fonts.body11};
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }
  .emphasis-text {
    ${fonts.h5}
    color: ${({ theme }) => theme.color.text07};
    ${media.tablet} {
      ${fonts.h6};
    }
    ${media.mobile} {
      ${fonts.body9};
    }
    font-weight: 700 !important;
  }
  .description {
    text-align: center;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text05};
    ${media.tablet} {
      ${fonts.p2};
    }
    ${media.mobile} {
      text-align: start;
      ${fonts.p4};
    }
  }
`;
