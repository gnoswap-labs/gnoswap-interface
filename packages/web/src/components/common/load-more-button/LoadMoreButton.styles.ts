import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start", false)}
  ${fonts.body11};
  color: ${theme.colors.gray40};
  gap: 4px;
  .icon-load {
    width: 16px;
    height: 16px;
    * {
      fill: ${theme.colors.gray40};
    }
  }
`;
