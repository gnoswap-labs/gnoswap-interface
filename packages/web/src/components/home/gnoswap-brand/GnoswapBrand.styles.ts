import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const GnoswapBrandWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 706px;
  width: 100%;
  gap: 34px;
  ${media.tablet} {
    max-width: 547px;
    padding: 10px 0px;
  }
  ${media.mobile} {
    max-width: 328px;
    align-items: center;
    gap: 32px;
  }

  .sns {
    ${mixins.flexbox("row", "center", "flex-start")}
    flex-wrap: nowrap;
    gap: 24px;
    button {
      width: 28px;
      height: 28px;
      &:hover {
        .icon * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
      .icon {
        width: 28px;
        height: 28px;
        * {
          transition: all 0.3s ease;
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
    }
  }
`;

export const HeroTitleContainer = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  gap: 20px;
  ${media.tablet} {
  }
  ${media.mobile} {
    gap: 8px;
  }
`;

export const TitleWrapper = styled.h1`
  ${fonts.h1};
  color: ${({ theme }) => theme.color.text02};

  ${media.tablet} {
    font-size: 46px;
    line-height: 55px;
  }
  ${media.mobile} {
    font-size: 36px;
    font-weight: 600;
    line-height: 43px;
  }

  span {
    color: ${({ theme }) => theme.color.point};
  }
`;
export const SubTitleWrapper = styled.h4`
  font-size: 28px;
  font-weight: 600;
  line-height: 34px;
  color: ${({ theme }) => theme.color.text02};
  ${media.tablet} {
    font-size: 20px;
    line-height: 24px;
  }
  ${media.mobile} {
    font-size: 18px;
    line-height: 22px;
  }
`;

export const DescriptionContainer = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  max-width: 706px;
  width: 100%;
  gap: 10px;
  ${media.tablet} {
    max-width: 547px;
  }
`;

export const DescriptionTitle = styled.p`
  ${fonts.body8};
  color: ${({ theme }) => theme.color.text04};
  ${media.tablet} {
    ${fonts.body10};
  }
`;
