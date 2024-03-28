import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const StakingWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 24px;
`;

export const StakingAnchor = styled.div`
  position: relative;
  visibility: hidden;
  display: block;
  top: -87px;
  ${media.tablet} {
    top: -75px;
  }
  ${media.mobile} {
    display: none;
  }
`;