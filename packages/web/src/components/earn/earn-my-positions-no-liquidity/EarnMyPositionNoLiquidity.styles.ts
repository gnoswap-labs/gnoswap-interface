import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const NoLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body3};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  height: 170px;
  padding: 36px;
  gap: 8px;
  ${media.tablet} {
    padding: 24px;
    height: auto;
    ${fonts.h6};
  }
  ${media.mobile} {
    padding: 16px 12px;
    ${fonts.body10};
  }
  .emphasis-text {
    ${fonts.h5}
    color: ${({ theme }) => theme.color.point};
    ${media.tablet} {
      ${fonts.h6};
    }
    ${media.mobile} {
      ${fonts.body9};
    }
  }
  .description {
    ${fonts.body10};
    color: ${({ theme }) => theme.color.text05};
    ${media.tablet} {
      ${fonts.body12};
    }
    ${media.mobile} {
      ${fonts.p2};
    }
  }
`;
