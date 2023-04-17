import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  background-color: ${theme.colors.colorBlack};
  section {
    width: 100%;
  }
  .earn-content {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: wrap;
    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;
  }
  .earn-title {
    ${fonts.h3};
    color: ${theme.colors.gray10};
  }
  .position-section {
    margin-top: 36px;
  }
  .incentivized-section {
    margin: 36px 0px 100px;
  }
`;
