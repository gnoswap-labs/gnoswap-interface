import mixins from "@styles/mixins";
import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${theme.color.background01};

  .dashboard-section,
  .activities-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    width: 100%;
    margin: 100px auto;
  }

  .container {
    width: 100%;
    max-width: 1440px;
    padding: 0 40px;
  }

  .dashboard-section {
    .title-container {
      .title {
        ${fonts.h3};
        color: ${theme.color.text02};
      }
      margin-bottom: 36px;
    }
    .charts-container {
      margin-bottom: 36px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-gap: 24px;
      grid-template-columns: repeat(2, 1fr);
    }
    .dashboard-info-container {
    }
  }

  .activities-section {
    position: relative;
    .activities-container {
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
        ${theme.color.backgroundGradient2} 0%,
        ${theme.color.backgroundGradient3} 100%
      );
    }
  }
`;
