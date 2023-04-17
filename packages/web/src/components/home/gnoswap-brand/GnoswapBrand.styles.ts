import mixins from "@/styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  .title {
    ${fonts.h1};
    color: ${theme.colors.gray10};
    line-height: 1.2;

    span {
      color: ${theme.colors.colorPoint};
    }
  }

  .subtitle {
    ${fonts.h4};
    color: ${theme.colors.gray10};

    margin-top: 8px;
  }

  .sns {
    ${mixins.flexbox("row", "center", "flex-start")}
    flex-wrap: nowrap;
    gap: 24px;
    height: 36px;
    margin-top: 54px;
    button {
      width: 36px;
      height: 36px;
      &:hover {
        .icon * {
          fill: ${theme.colors.gray10};
        }
      }
      .icon {
        width: 36px;
        height: 36px;
        * {
          transition: all 0.3s ease;
          fill: ${theme.colors.gray40};
        }
      }
    }
  }

  .description {
    ${fonts.body8};
    color: ${theme.colors.gray40};
    line-height: 1.4;

    margin-top: 16px;
  }
`;
