import mixins from "@/styles/mixins";
import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  .title {
    ${theme.fonts.h1};
    color: ${theme.colors.gray10};
    line-height: 1.2;

    span {
      color: ${theme.colors.colorPoint};
    }
  }

  .subtitle {
    ${theme.fonts.h4};
    color: ${theme.colors.gray10};

    margin-top: 8px;
  }

  .sns {
    ${mixins.flexbox("row", "center", "flex-start")}
    flex-wrap: nowrap;
    gap: 24px;

    margin-top: 54px;

    .icon {
      width: 36px;
      height: 36px;
    }
    .icon * {
      fill: ${theme.colors.gray40};
    }
  }

  .description {
    ${theme.fonts.body4};
    color: ${theme.colors.gray40};
    line-height: 1.4;

    margin-top: 16px;
  }
`;
