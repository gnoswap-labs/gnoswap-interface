import { css, Theme } from "@emotion/react";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  main {
    ${mixins.flexbox("row", "center", "center")};
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;
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

  .increase-liquidity-section {
    margin: 0 auto;
    height: 100%;
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
    .increase-liquidity-section {
      margin: auto;
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
    .increase-liquidity-section {
      margin: none;
    }
  }
  ${media.mobile} {
    .content-wrap {
      padding: 0 16px;
    }
    .increase-liquidity-section {
      width: 100%;
    }
  }
`;
