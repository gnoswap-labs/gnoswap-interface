import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center", false)};
  ${fonts.p3};
  height: 26px;
  padding: 0px 8px;
  background-color: ${theme.color.background06};
  color: ${theme.color.text04};
  border-radius: 2px;

  span {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${theme.color.text02};
    }
    &:last-of-type {
      color: ${theme.color.text05};
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
`;
