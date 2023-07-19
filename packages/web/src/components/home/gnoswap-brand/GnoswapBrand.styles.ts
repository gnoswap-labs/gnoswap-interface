import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  .title {
    ${fonts.h1};
    color: ${theme.color.text02};
    line-height: 1.2;

    span {
      color: ${theme.color.point};
    }
  }

  .subtitle {
    font-size: 28px;
    font-weight: 600;
    line-height: 34px;
    color: ${theme.color.text02};

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
          fill: ${theme.color.icon07};
        }
      }
      .icon {
        width: 28px;
        height: 28px;
        * {
          transition: all 0.3s ease;
          fill: ${theme.color.icon03};
        }
      }
    }
  }

  .description {
    ${fonts.body8};
    color: ${theme.color.text04};
    line-height: 1.4;

    margin-top: 10px;
  }
`;
