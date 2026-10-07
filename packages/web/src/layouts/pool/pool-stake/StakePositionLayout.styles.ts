import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  min-height: 100%;
  ${mixins.flexbox("column", "flex-start", "space-between")};
  main {
    ${mixins.flexbox("row", "flex-start", "center")};
    gap: 24px;
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;
  }
  .available-pools-section {
    width: 412px;
    flex-shrink: 0;
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

  .right-container {
    ${mixins.flexbox("row", "flex-start", "flex-end")};
    width: 100%;
    gap: 16px;
    margin-top: 8px;
    ${media.tablet} {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    ${media.mobile} {
      gap: 8px;
      align-items: center;
    }
  }

  .add-liquidity-section {
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
      ${mixins.flexbox("column", "stretch", "flex-start")};
      gap: 24px;
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
    .stake-liquidity-section {
      margin: none;
      width: 100%;
    }
    .available-pools-section {
      width: 100%;
    }
  }
  ${media.mobile} {
    .content-wrap {
      padding: 0 16px;
    }
  }
`;
