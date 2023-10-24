import { css } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 4px;
  > a {
    width: 100%;
  }
  ${media.mobile} {
    gap: 4px;
  }
`;
