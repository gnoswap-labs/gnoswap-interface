import mixins from "@styles/mixins";
import { css } from "@emotion/react";

export const wrapper = () => css`
  .hero-section,
  .tokens-section {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    flex-wrap: wrap;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }

  .hero-section {
    padding: 100px 40px 30px;
  }

  .tokens-section {
    padding: 30px 40px 100px;
  }

  .brand-container {
    width: 706px;
  }

  .swap-container {
    width: 520px;
  }

  .card-list {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-gap: 24px;
    grid-template-columns: repeat(3, 1fr);

    margin-top: 120px;
  }
`;
