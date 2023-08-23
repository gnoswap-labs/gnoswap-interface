import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  color: ${theme.color.text02};
  ${fonts.h5}
  ${media.mobile} {
    ${fonts.h6}
  }
`;
