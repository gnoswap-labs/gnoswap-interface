import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  main {
    ${mixins.flexbox("row", "center", "flex-end")};
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 0 0 40px;
  }
  .wrapper-sub-content {
    ${mixins.flexbox("row", "flex-start", "flex-end")};
    &.full-width {
      width: 100%;
    }
  }
  .title-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${mixins.posMoveToTopAndLeft(0, "40px")};
    gap: 8px;
    ${media.mobile} {
      gap: 10px;
    }
    .title {
      ${fonts.h3};
      color: ${theme.color.text02};
    }
  }

  .additional-info-section {
    padding: 0 24px 0 16px;
  }

  .add-liquidity-section {
    margin: 0 auto;
    height: 100%;
  }
  .one-click-staking {
    &.margin-bottom {
      margin-bottom: 16px;
    }
    .fake-div {
    }
  }
  .content-default {
    ${media.tablet} {
      display: none;
    }
  }
  ${media.tablet} {
    main {
      margin: 60px 0;
      padding: 0 40px;
      ${mixins.flexbox("column", "flex-start", "center")};
    }
    .wrapper-sub-content {
      ${mixins.flexbox("column", "flex-start", "center")};
      width: 100%;
    }
    .title-container {
      .title {
        ${fonts.h4};
      }
    }
    .additional-info-section {
      width: 100%;
      margin: auto;
      padding: 0;
    }
    .exchange-rate-graph {
      margin: auto;
      max-width: 500px;
      width: 100%;
    }
    .add-liquidity-section {
      margin: auto;
    }
    .one-click-staking {
      margin: 16px auto 0;
      width: 100%;
      max-width: 500px;
      .fake-div {
        width: 430px;
      }
    }
    .content-default {
      display: none;
    }
  }
  ${media.tabletMiddle} {
    main {
      margin: 24px 0;
      padding: 0 40px;
    }
    .title-container {
      position: initial;
      ${mixins.flexbox("row", "center", "flex-start")};
      .title {
        ${fonts.h5};
      }
    }
    .content-wrap {
      gap: 24px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    .add-liquidity-section {
      margin: none;
    }
    
  }
  ${media.mobile} {
    .content-wrap {
      padding: 0 16px;
    }
    .add-liquidity-section {
      width: 100%;
    }
  }
`;
