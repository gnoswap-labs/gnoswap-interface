import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const wrapper = (theme: Theme) => css`
  background-color: ${theme.colors.colorBlack};
  section,
  .earn-content {
    width: 100%;
  }

  .earn-content {
    padding: 100px 0px;
  }

  .earn-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto 100px;
    padding: 0 40px;

    .earn-title {
      ${fonts.h3};
      color: ${theme.colors.gray10};
    }

    .position-section,
    .incentivized-section {
      margin-top: 36px;
    }
  }

  .pools-wrap {
    width: 100%;
    padding-top: 100px;
    position: relative;

    .pools-section {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 40px;
      position: relative;
      z-index: 1;
    }

    .gradient-bg {
      position: absolute;
      top: 0px;
      width: 100%;
      height: 400px;
      background: linear-gradient(
        180deg,
        ${theme.colors.gray60}80 0%,
        ${theme.colors.gray60}00 100%
      );
    }
  }
`;
