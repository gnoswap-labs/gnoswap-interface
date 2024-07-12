import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center", false)};
  ${fonts.p3};
  height: 26px;
  padding: 0px 8px;
  background-color: ${theme.color.backgroundOpacity3};
  color: ${theme.color.text04};
  border-radius: 2px;

  span {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${theme.color.text16};
    }
    &:last-of-type {
      color: ${theme.color.text10};
      cursor: default;
    }
  }

  .step-icon {
    width: 16px;
    height: 16px;
    margin: 0px 4px;
    * {
      fill: ${theme.color.icon03};
    }
  }

  .token-symbol-path {
    ${mixins.flexbox("row", "center", "center")}
    ${fonts.p3};
    gap: 4px;

    .token-path {
      ${mixins.flexbox("row", "center", "center")}
      ${fonts.p3};
      gap: 4px;
      &:hover {
        color: ${theme.color.text10};
        cursor: pointer;
        .path-link-icon {
          path {
            fill: ${theme.color.text10};
          }
        }
      }
      color: ${theme.color.text04};

      .path-link-icon {
        width: 10px;
        height: 10px;
        fill: ${theme.color.text04};
      }
    }
  }

  @media (max-width: 1180px) {
    height: 24px;
  }
`;
