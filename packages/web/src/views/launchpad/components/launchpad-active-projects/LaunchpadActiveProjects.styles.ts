import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadActiveProjectsWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 24px;
  ${media.tablet} {
    align-items: flex-start;
  }
  ${media.mobile} {
    gap: 16px;
  }
`;
