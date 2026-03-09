import styled from "@emotion/styled";

import { media } from "@styles/media";
import { Z_INDEX } from "@styles/zIndex";

export const SnackbarList = styled.div`
  display: block;
  position: fixed;
  top: 82px;
  right: 30px;
  width: 380px;

  z-index: ${Z_INDEX.snackbar};
  ${media.tablet} {
    top: 70px;
    right: 30px;
  }
  ${media.mobile} {
    width: 328px;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
`;
