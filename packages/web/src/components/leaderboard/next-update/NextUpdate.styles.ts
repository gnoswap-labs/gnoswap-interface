import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TextWrapper = styled.div`
  width: 185px;
  ${media.tablet} {
    width: 165px;
  }
  ${media.mobile} {
    width: 140px;
  }
`;

export const Height24 = styled.div`
  height: 24px;
  ${media.tablet} {
    height: auto;
  }
`;
