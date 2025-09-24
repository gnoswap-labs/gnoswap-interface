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
    padding: 100px 40px;
    margin: 0 auto;
    ${media.tablet} {
      padding: 40px;
    }
    ${media.mobile} {
      padding: 48px 16px;
      ${mixins.flexbox("column", "center", "center")}
    }
  }

  .launchpad-container {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 60px;
    height: 600px;
    ${media.tablet} {
      height: 460px;
    }
    ${media.mobile} {
      height: 100%;
      ${mixins.flexbox("column-reverse", "center", "space-between")};
      margin-bottom: 0px;
    }
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
      width: 50%;
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px 60px 0px;
      gap: 24px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 24px 0px;
      gap: 24px;
    }
  }

  .launchpad-title-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    gap: 12px;
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "center")};
      gap: 8px;
    }

    .title {
      ${mixins.flexbox("column", "flex-end", "center")};
      font-size: clamp(3rem, 1.8041rem + 1.6216vw, 3.75rem);
      font-weight: 700;
      line-height: 72px;

      color: ${({ theme }) => theme.color.text02};
      ${media.tablet} {
        font-size: clamp(3rem, 1.8041rem + 1.6216vw, 3.75rem);
        font-weight: 700;
      }
      ${media.mobile} {
        font-size: clamp(2.25rem, 1.9207rem + 1.4634vw, 3rem);
        font-weight: 600;
        line-height: normal;
        text-align: center;
      }
    }

    .sub-title {
      ${mixins.flexbox("column", "flex-end", "center")};
      font-size: clamp(1.125rem, 0.527rem + 0.8108vw, 1.5rem);
      font-weight: 400;
      line-height: 33.6px;
      white-space: nowrap;
      color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.border07 : theme.color.text03)};
      ${media.tablet} {
        white-space: normal;
        font-size: clamp(1.125rem, 0.3665rem + 1.3636vw, 1.5rem);
        font-weight: 500;
        line-height: 25.2px;
      }
      ${media.mobile} {
        font-size: clamp(1rem, 0.9451rem + 0.2439vw, 1.125rem);
        font-weight: 500;
        line-height: 20.8px;
        text-align: center;
        white-space: normal;
      }
    }
  }

  .launchpad-button-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 16px;
    width: 100%;
    ${media.mobile} {
      gap: 8px;
    }
    .launchpad-guide-button {
      ${media.mobile} {
        width: 50%;
        height: 36px;
      }
      button {
        ${mixins.flexbox("row", "flex-start", "center")};
        height: 100%;
        color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text02 : "#FFF")};
        gap: 8px;
        border-radius: 8px;
        padding: 16px 18.5px;
        &:hover {
          background-color: ${({ theme }) =>
            theme.themeKey === "dark" ? theme.color.backgroundGradient : theme.color.background04Hover};
        }
        ${media.mobile} {
          ${mixins.flexbox("row", "center", "center")};
          width: 100%;
          padding: 10px 16px;
        }
        span {
          font-size: 16px;
          font-weight: 500;
          line-height: 20.8px;
          ${media.mobile} {
            font-size: clamp(0.875rem, 0.8201rem + 0.2439vw, 1rem);
          }
        }
        * {
          fill: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.text02 : "#FFF")};
        }
      }
    }
  }

  .launchpad-data-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    ${media.mobile} {
      gap: 24px;
    }
    .launchpad-data-list {
      ${mixins.flexbox("column", "flex-start", "space-between")};
      gap: 6px;
      height: 51px;
      color: var(--Global-Color-White, #fff);
      ${media.mobile} {
        height: 44px;
      }
      .launchpad-data-key {
        color: ${({ theme }) => theme.color.text04};
        ${media.mobile} {
          font-size: clamp(0.875rem, 0.8201rem + 0.2439vw, 1rem);
        }
      }
      .launchpad-data-value {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 4px;
        color: ${({ theme }) => (theme.themeKey === "dark" ? "#E0E8F4" : theme.color.text03)};
        ${media.mobile} {
          font-size: clamp(0.875rem, 0.8201rem + 0.2439vw, 1rem);
        }
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .launchpad-image-wrapper {
    ${mixins.flexbox("column", "center", "center")};
    gap: 24px;
    padding: 0px 110px;
    ${media.tablet} {
      width: 50%;
      padding: 0px 85px;
    }
    ${media.mobile} {
      width: auto;
      padding: 0px 33px;
      padding: 0px;
    }
  }

  .launchpad-mobile-title-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    .mobile-title {
      color: ${({ theme }) => theme.color.text02};
    }
    font-size: clamp(1.9375rem, 1.471rem + 2.0732vw, 3rem);
    font-weight: 700;
    text-align: center;
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

  .projects-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: relative;
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 50px 0px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      padding: 48px 0px;
    }
  }

  .projects-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 24px;
    ${media.mobile} {
      padding: 0px 16px;
    }
  }

  .project-list {
    width: 100%;
  }
`;
