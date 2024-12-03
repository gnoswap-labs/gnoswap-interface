import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadPoolListWrapper = styled.div`
  ${mixins.flexbox("row", "center", "cetner")}
  width: 100%;
  gap: 16px;
  ${media.tablet} {
    gap: 12px;
    overflow-x: auto;
  }
`;
