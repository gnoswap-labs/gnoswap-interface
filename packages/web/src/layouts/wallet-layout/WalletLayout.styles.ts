import mixins from "@styles/mixins";
import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${theme.colors.colorBlack};

  section {
    ${mixins.flexbox("column", "center", "flex-start")};
    width: 100%;

    .container {
      width: 100%;
      max-width: 1440px;
      padding: 0 40px;
    }
  }

  .summary-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    margin: 100px auto;

    .title-container {
      margin-bottom: 36px;

      .title {
        ${fonts.h3};
        color: ${theme.colors.gray10};
      }
    }

    .balance-container {
    }
  }

  .detail-section {
    position: relative;
    margin: 100px auto;

    .assets-container {
    }

    .positions-container {
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
        ${theme.colors.gray60}80 0%,
        ${theme.colors.gray60}00 100%
      );
    }
  }
`;
