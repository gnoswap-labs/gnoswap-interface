import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  background-color: ${theme.colors.colorBlack};
  color: ${theme.colors.gray10};
  section {
    width: 100%;
    border: 1px solid green;
  }
  .pool-content {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;
    border: 1px solid green;
  }
  .title-container {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    margin-bottom: 36px;
    border: 1px solid green;
  }
  .pool-title {
    ${theme.fonts.h3};
    color: ${theme.colors.gray10};
    border: 1px solid green;
  }
  .breadcrumbs {
    border: 1px solid green;
  }

  .liquidity-section {
    margin: 80px 0px;
  }

  .add-incentive-section {
    margin-top: 36px;
  }
`;
