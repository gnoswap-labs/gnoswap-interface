import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "flex-start")}
  width: 100%;
  height: 36px;
  h3 {
    ${fonts.h5};
    color: ${theme.color.text02};
    margin: 0px 8px;
  }
  .badge-wrap {
    ${mixins.flexbox("row", "center", "center")}
    gap: 2px;
  }
`;
