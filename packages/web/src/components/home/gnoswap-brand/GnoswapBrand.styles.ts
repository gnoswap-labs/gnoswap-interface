import mixins from "@styles/mixins";
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
    font-size: 28px;
    font-weight: 600;
    line-height: 34px;
    color: ${theme.colors.gray10};

    margin: 20px 0px 34px;
  }

  .sns {
    ${mixins.flexbox("row", "center", "flex-start")}
    flex-wrap: nowrap;
    gap: 24px;
    button {
      width: 28px;
      height: 28px;
      &:hover {
        .icon * {
          fill: ${theme.colors.gray10};
        }
      }
      .icon {
        width: 28px;
        height: 28px;
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

    margin-top: 10px;
  }
`;
