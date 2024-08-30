import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { ContainerWidth, media } from "@styles/media";

export const GovernanceLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  color: ${({ theme }) => theme.color.text10};
  .governance-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding-top: 100px;
    gap: 36px;
    @media (max-width: 1180px) {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding-top: 60px;
      gap: 24px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 24px 16px 0px 16px;
      gap: 12px;
    }

    .title-container {
      position: relative;
      max-width: ${ContainerWidth.WEB_CONTAINER};
      width: 100%;
      padding: 0px 40px 0px 40px;
      ${media.tablet} {
        gap: 16px;
      }
      ${media.mobile} {
        padding: 0px 0px 0px 0px;
        gap: 12px;
      }

      .title {
        display: inline-block;
        ${fonts.h3};
        color: ${({ theme }) => theme.color.text02};
        @media (max-width: 1180px) {
          ${fonts.h4};
        }
        ${media.mobile} {
          ${fonts.h5};
        }
      }
    }

    .summary-container {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      max-width: ${ContainerWidth.WEB_CONTAINER};
      width: 100%;
      padding: 0px 40px;
      margin: 0 auto;
      gap: 40px;
      @media (max-width: 1180px) {
        gap: 16px;
      }

      ${media.mobile} {
        padding: 12px 0px 24px 0px;
      }
    }
  }

  .proposal-list-wrapper {
    position: relative;
    margin-top: 100px;
    width: 100%;
    padding-top: 100px;
    padding-bottom: 48px;

    ${media.tablet} {
      padding-top: 60px;
      margin-top: 40px;
    }

    ${media.mobile} {
      padding-top: 24px;
      margin-top: 24px;
    }

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

    .proposal-list-container {
      position: relative;
      margin: 0 auto;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      max-width: ${ContainerWidth.WEB_CONTAINER};
      width: 100%;
      padding: 0px 40px;
      gap: 22px;
      @media (max-width: 1180px) {
        gap: 16px;
      }

      ${media.mobile} {
        padding: 0px 16px;
      }
    }
  }
`;
