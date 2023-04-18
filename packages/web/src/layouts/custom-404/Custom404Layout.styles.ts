import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  height: 100%;
  ${mixins.flexbox("column", "center", "flex-start")}
  main {
    ${mixins.flexbox("row", "center", "center")}
    max-width: 1440px;
    /* min-height: 100%; */
    flex-grow: 1;
    padding: 0 40px;
    margin: 0 auto;
  }

  .content-section {
    ${mixins.flexbox("column", "center", "center")}
    margin-left: 120px;
    strong {
      ${fonts.h1};
      font-size: 80px;
      line-height: 96px;
      color: ${theme.colors.gray10};
    }
    p {
      ${fonts.body3};
      color: ${theme.colors.gray30};
      margin: 4px 0px 48px;
    }
  }

  .arrow-icon {
    margin-right: 8px;
  }
`;
