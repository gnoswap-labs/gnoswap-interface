import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { ContainerWidth, media } from "@styles/media";

export const LeaderboardLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .leaderboard-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px 36px 0px;

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

  .title-container {
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
  }

  .title {
    ${mixins.flexbox("column", "flex-end", "center")};
    ${fonts.h3};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h5};
    }
  }

  .charts-container {
    display: grid;
    width: 100%;
    max-width: ${ContainerWidth.WEB_CONTAINER};
    column-gap: 24px;
    grid-template-columns: repeat(2, 1fr);
    padding: 0px 40px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      grid-template-columns: repeat(2, 1fr);
    }
    ${media.mobile} {
      grid-template-columns: repeat(1, auto);
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      padding: 0px 0px 0px 0px;
      row-gap: 8px;
      column-gap: 24px;
    }
  }

  .leaderboard-info-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      align-items: center;
      padding: 0px 0px 0px 0px;
    }
  }

  .activities-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    // padding: 100px 0px 100px 0px;

    padding-bottom: 48px;

    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      //   padding: 60px 0px 60px 0px;
      padding-left: 16px;
      padding-right: 16px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      //   padding: 48px 16px 48px 16px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  .activities-section {
    position: relative;
    .activities-container {
      ${mixins.flexbox("column", "center", "center")};
      max-width: ${ContainerWidth.WEB_CONTAINER};
      width: 100%;
      padding: 0px 40px;
      gap: 24px;
      ${media.tablet} {
        max-width: ${ContainerWidth.TABLET_CONTAINER};
      }
      ${media.mobile} {
        max-width: ${ContainerWidth.MOBILE_CONTAINER};
        padding: 0px;
        gap: 24px;
      }
    }
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

  .sub-title-layout {
    // position: absolute;
    ${mixins.flexbox("row", "center", "center", false)};
    // ${fonts.body11};
    gap: 4px;
    // margin-left: 20px;
    margin-left: 5px;
    bottom: 7px;
    top: 19px;
    cursor: pointer;
    p {
      display: inline-block;
    }
    // color: ${({ theme }) => theme.color.text04};
    // svg * {
    //   fill: ${({ theme }) => theme.color.icon03};
    // }
    // &:hover {
    color: ${({ theme }) => theme.color.text03};
    svg {
      * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
    // }
    @media (max-width: 1180px) {
      margin-left: 12px;
      bottom: 6px;
      top: 15px;
    }
    ${media.mobile} {
      margin-left: 10px;
      bottom: 2px;
      top: 9px;
    }
  }

  .setting-button {
    width: 24px;
    height: 24px;
  }
  .link-button {
    position: relative;
  }
`;
