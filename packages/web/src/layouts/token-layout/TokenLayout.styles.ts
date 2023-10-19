import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  .title-container {
    flex-wrap: wrap;
    position: relative;
    width: max-content;
    max-width: 1440px;
    margin: 100px auto 0 0;
    padding-left: 40px;

    .title {
      ${fonts.h3};
      color: ${theme.color.text02};
      @media (max-width: 1180px) {
        ${fonts.h4};
      }
      @media (max-width: 768px) {
        ${fonts.h5};
      }
    }
    .breadcrumbs {
      position: absolute;
      width: max-content;
      height: max-content;
      left: calc(100% + 20px);
      top: 12px;
      bottom: 6px;
      @media (max-width: 1180px) {
        left: calc(100% + 12px);
        top: 10px;
        bottom: 5px;
      }
      ${media.mobile} {
        left: calc(100% + 10px);
        top: 3px;
        bottom: 2px;
      }
    }
  }

  .main-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 24px;

    max-width: 1440px;
    margin: 36px auto 100px;
    padding: 0 40px;

    @media (max-width: 1180px) {
      gap: 16px;
    }
    @media (max-width: 930px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    .main-section {
      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;
      flex: 1;
      max-width: 836px;
      min-width: 644px;
      @media (max-width: 1180px) {
        max-width: 654px;
        min-width: 488px;
      }
      @media (max-width: 930px) {
        max-width: 100%;
        min-width: auto;
      }
      .chart {
        width: 100%;
      }

      .info {
        width: 100%;
      }

      .description {
        width: 100%;
      }
    }

    .right-section {
      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;

      max-width: 500px;

      .swap {
        width: 100%;
      }

      .best-pools {
        width: 100%;
      }

      .trending {
        width: 100%;
      }

      .gainers-losers {
        width: 100%;
      }
      @media (max-width: 1180px) {
        max-width: 430px;
        min-width: 346px;
      }
      @media (max-width: 930px) {
        width: 100%;
        max-width: 100%;
        min-width: auto;
      }
    }
  }
`;
