import mixins from "@/styles/mixins";
import { css, Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  background-color: ${theme.colors.colorBlack};

  .hero-section {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;

    width: 1440px;
    margin: 100px auto;
    padding: 0 40px;

    .brand-container {
      width: 706px;
    }

    .swap-container {
      width: 520px;
    }

    .card-list {
      ${mixins.flexbox("row", "center", "space-between")};

      width: 1440px;
      margin-top: 120px;
    }
  }

  .tokens-section {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;

    width: 1440px;
    margin: 0 auto;
    padding: 0 40px;

    ${mixins.flexbox("row", "center", "space-between")};
  }
`;
