import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  .title-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    flex-wrap: wrap;

    width: 100%;
    max-width: 1440px;
    margin: 100px auto 0;
    padding: 0 40px;

    .title {
      ${fonts.h3};
      color: ${theme.color.text02};

      width: 100%;
    }
  }

  .main-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 24px;

    max-width: 1440px;
    margin: 36px auto 100px;
    padding: 0 40px;

    .main-section {
      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;

      width: 100%;

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

      width: 430px;

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
    }
  }
`;
