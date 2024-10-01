import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { ContainerWidth, media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .launchpad-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px 100px 0px;
    gap: 36px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px 60px 0px;
      gap: 24px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 24px 16px 48px 16px;
      gap: 24px;
    }
  }

  .launchpad-title-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px 0px 40px;
    gap: 16px;
    ${media.tablet} {
      gap: 16px;
    }
    ${media.mobile} {
      padding: 0px 0px 0px 0px;
      gap: 24px;
    }

    .title {
      ${mixins.flexbox("column", "flex-end", "center")};
      ${fonts.h3};
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.h5};
      }
    }
  }
`;