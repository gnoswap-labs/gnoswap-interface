import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
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

  .remove-liquidity-section {
    margin: 0 auto;
    height: 100%;
  }

  ${media.tablet} {
    main {
      margin: 60px 0;
    }
    .title-container {
      .title {
        ${fonts.h4};
      }
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
    .remove-liquidity-section {
      margin: none;
      width: 100%;
    }
  }
  ${media.mobile} {
    .content-wrap {
      padding: 0 16px;
    }
  }
`;
