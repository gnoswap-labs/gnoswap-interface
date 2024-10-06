import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { ContainerWidth, media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  main {
    ${mixins.flexbox("column", "center", "center")}
    width: 100%;
    max-width: 1440px;
    gap: 36px;
    flex-grow: 1;
    padding: 100px 40px 60px;
    margin: 0 auto;
    ${media.tablet} {
      /* padding: 118px 40px; */
    }
    ${media.mobile} {
      padding: 48px 0;
      ${mixins.flexbox("column", "center", "center")}
    }
  }

  .launchpad-container {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 60px;
  }

  .launchpad-active-project {
    width: 100%;
  }

  .icon-launchpad {
    width: 435.158px;
    height: 600px;
    object-fit: cover;
    ${media.tablet} {
      width: 300px;
      height: 252px;
    }
    ${media.mobile} {
      width: 237.5px;
      height: 200px;
      margin-bottom: 24px;
    }
  }

  .launchpad-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    gap: 48px;
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
    gap: 12px;

    .title {
      ${mixins.flexbox("column", "flex-end", "center")};
      font-size: 60px;
      font-weight: 700;
      line-height: 72px;

      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.h5};
      }
    }

    .sub-title {
      ${mixins.flexbox("column", "flex-end", "center")};
      font-size: 24px;
      font-weight: 400;
      line-height: 33.6px;

      color: ${({ theme }) => theme.color.text03};
      ${media.mobile} {
        ${fonts.h5};
      }
    }
  }

  .launchpad-button-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 16px;
    width: 100%;
    button {
      ${mixins.flexbox("row", "flex-start", "center")};
      color: var(--Global-Color-White, #fff);
      gap: 8px;
      background: var(--border2-dark_gray500Border2, #1c2230);
      border-radius: 8px;
      padding: 16px;
    }
  }

  .launchpad-data-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 16px;
    width: 100%;
    .launchpad-data-list {
      ${mixins.flexbox("column", "flex-start", "center")};
      gap: 6px;
      color: var(--Global-Color-White, #fff);
      .launchpad-data-key {
        color: ${({ theme }) => theme.color.text04};
      }
      .launchpad-data-value {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 4px;
        color: ${({ theme }) => theme.color.text03};
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .launchpad-image-wrapper {
    padding: 0px 110px;
  }
`;
