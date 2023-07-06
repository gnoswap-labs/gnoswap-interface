import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  .title-container {
    border: 1px solid ${theme.colors.colorGreen};

    ${mixins.flexbox("row", "flex-start", "space-between")};
    flex-wrap: wrap;

    width: 100%;
    margin: 100px auto 0;
    padding: 0 40px;

    .title {
      border: 1px solid ${theme.colors.colorGreen};

      ${fonts.h3};
      color: ${theme.colors.gray10};

      width: 100%;
    }

    .breadcrumbs {
      border: 1px solid ${theme.colors.colorGreen};
    }
  }

  .main-container {
    border: 1px solid ${theme.colors.colorGreen};

    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 24px;

    max-width: 1440px;
    margin: 36px auto 100px;
    padding: 0 40px;

    .main-section {
      border: 1px solid ${theme.colors.colorGreen};

      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;

      width: 100%;

      .chart {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }

      .info {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }

      .description {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }
    }

    .right-section {
      border: 1px solid ${theme.colors.colorGreen};

      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;

      width: 430px;

      .swap {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }

      .best-pools {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }

      .trending {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }

      .gainers-losers {
        border: 1px solid ${theme.colors.colorGreen};

        width: 100%;
      }
    }
  }
`;
