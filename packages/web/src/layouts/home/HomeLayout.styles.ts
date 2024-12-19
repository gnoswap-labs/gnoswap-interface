import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { ContainerWidth, media } from "@styles/media";

export const HomeLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
`;

export const HeroSection = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
  width: 100%;
  padding: 100px 0px 30px 0px;
  gap: 80px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
    padding: 60px 0px 20px 0px;
    gap: 40px;
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    width: 100%;
    padding: 36px 16px 24px 16px;
    gap: 0px;
  }
`;

export const BrandContainer = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    flex-direction: column;
    padding: 0px;
    gap: 24px;
  }
`;

export const CardContainer = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px;
  gap: 24px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
  }
  @media (min-width: 769px) and (max-width: 1180px) {
    overflow: scroll;
    > div {
      min-width: 300px;
    }
  }
`;

export const TokensSection = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
  width: 100%;
  padding: 30px 0px 60px 0px;
  gap: 120px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
    padding: 20px 0px 40px 0px;
    gap: 60px;
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    width: 100%;
    padding: 24px 16px 36px 16px;
    gap: 120px;
  }
`;

export const TokensContainer = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px;
  gap: 24px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
    align-items: flex-start;
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    padding: 0px;
    align-items: center;
  }
`;

export const BannerContainer = styled.div`
  max-width: ${ContainerWidth.WEB_CONTAINER};
  padding: 0px 40px;
  margin-bottom: 100px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
    align-items: flex-start;
    margin-bottom: 60px;
  }
  ${media.mobile} {
    padding: 0 16px;
    margin-bottom: 48px;
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
  }
  width: 100%;
`;
