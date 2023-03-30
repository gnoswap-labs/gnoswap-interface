import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  .container {
    border: 1px solid ${theme.colors.colorGreen};

    ${mixins.flexbox("row", "flex-start", "space-between")};
    flex-wrap: wrap;

    max-width: 1440px;
    margin: 100px auto;
    padding: 0 40px;

    .page-name {
      width: 100px;
      ${theme.fonts.h3};
      color: ${theme.colors.gray10};
    }

    .swap {
      border: 1px solid ${theme.colors.colorGreen};

      width: 500px;
    }

    .empty {
      width: 100px;
    }
  }
`;
