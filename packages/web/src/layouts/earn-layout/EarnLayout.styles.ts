import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { ContainerWidth, media } from "@styles/media";
import mixins from "@styles/mixins";

export const EarnLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .earn-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 90%;
      padding: 24px 0px 48px 0px;
    }
  }

  .earn-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 36px;
    ${media.mobile} {
      padding: 0px 0px 0px 0px;
      gap: 24px;
    }
  }

  .position,
  .incentivized {
    width: 100%;
  }

  .earn-title {
    ${mixins.flexbox("row", "flex-end", "center")};
    ${fonts.h3};
    color: ${({ theme }) => theme.color.text02};
    ${media.tablet} {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
  }

  .pools-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: relative;
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      padding: 48px 0px;
    }
  }

  .pools-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 24px;
    ${media.mobile} {
      padding: 0px 16px;
    }
  }

  .pool-list {
    width: 100%;
  }

  .background-wrapper {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: relative;
    width: 100%;
    min-height: 400px;

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 400px;
      background: linear-gradient(
        180deg,
        ${({ theme }) => theme.color.backgroundGradient2} 0%,
        ${({ theme }) => theme.color.backgroundGradient3} 100%
      );
    }
  }
`;
