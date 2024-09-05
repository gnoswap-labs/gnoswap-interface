import styled from "@emotion/styled";

import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const LocalModalBackground = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  z-index: ${Z_INDEX.modal};
  pointer-events: none;

  > .content-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: 100%;
    max-height: calc(100lvh - 32px);
    margin: 0 auto;

    pointer-events: initial;

    ${media.mobile} {
      ${mixins.flexbox("column", "center", "flex-start")};
    }
  }
`;
