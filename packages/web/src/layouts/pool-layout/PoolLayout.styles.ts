import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  background-color: ${theme.colors.colorBlack};
  color: ${theme.colors.gray10};
  section {
    width: 100%;
  }
  .pool-content {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;
    width: 100%;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;
  }
  .title-container {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    margin-bottom: 36px;
  }
  .pool-title {
    ${fonts.h3};
    color: ${theme.colors.gray10};
  }

  .liquidity-section {
    margin: 80px 0px;
  }

  .add-incentive-section {
    margin-top: 36px;
  }
`;
