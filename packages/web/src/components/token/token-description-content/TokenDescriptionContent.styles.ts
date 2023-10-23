import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  color: ${theme.color.text01};
  p {
    ${fonts.body12};
    color: ${theme.color.text04};
    width: 100%;
    max-height: 180px;
    overflow: hidden;
    margin-bottom: 16px;
    &.auto-height {
      max-height: fit-content;
      overflow-y: visible;
    }
    ${media.mobile} {
      margin-bottom: 8px;
    }
  }
`;
