import { css } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = css`
  ${mixins.flexbox("column", "center", "center")};
  ${media.tablet} {
    align-items: flex-start;
  }
  ${media.mobile} {
    align-items: center;
  }
  width: 100%;
`;
