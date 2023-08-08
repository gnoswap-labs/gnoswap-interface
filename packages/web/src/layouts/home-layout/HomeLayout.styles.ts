import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const HomeLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
`;

export const HeroSection = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: 1920px;
  width: 100%;
  padding: 100px 0px 30px 0px;
  gap: 80px;
  ${media.tablet} {
    max-width: 1180px;
    padding: 60px 0px 20px 0px;
    gap: 40px;
  }
  ${media.mobile} {
    max-width: 360px;
    padding: 36px 0px 24px 0px;
    gap: 0px;
  }
`;

export const BrandContainer = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  max-width: 1440px;
  width: 100%;
  padding: 0px 40px;
  ${media.tablet} {
    max-width: 1180px;
  }
  ${media.mobile} {
    max-width: 360px;
    flex-direction: column;
    align-items: center;
    padding: 0px 16px;
    gap: 24px;
  }
`;

export const CardContainer = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  max-width: 1440px;
  width: 100%;
  padding: 0px 40px;
  gap: 24px;
  ${media.tablet} {
    max-width: 1180px;
  }
`;

export const TokensSection = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: 1920px;
  width: 100%;
  padding: 30px 0px 100px 0px;
  gap: 120px;
  ${media.tablet} {
    max-width: 1180px;
    padding: 20px 0px 60px 0px;
    gap: 60px;
  }
  ${media.mobile} {
    max-width: 360px;
    padding: 24px 0px 48px 0px;
    gap: 120px;
  }
`;

export const TokensContainer = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  max-width: 1440px;
  width: 100%;
  padding: 0px 40px;
  gap: 24px;
  ${media.tablet} {
    max-width: 1180px;
    align-items: flex-start;
  }
  ${media.mobile} {
    max-width: 360px;
    padding: 0px 16px;
    align-items: center;
  }
`;
