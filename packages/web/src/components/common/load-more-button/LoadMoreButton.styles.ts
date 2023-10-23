import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start", false)}
  ${fonts.body11};
  color: ${theme.color.text04};
  gap: 4px;
  .icon-load {
    width: 16px;
    height: 16px;
    * {
      fill: ${theme.color.icon03};
    }
  }
  &:hover {
    span {
      color: ${theme.color.text03};
    }
    transition: all 0.3s ease;
    svg {
      * {
        fill: ${theme.color.icon07};
      }
    }
  }
`;
