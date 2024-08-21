import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 24px;
  ${media.tablet} {
    align-items: center;
    gap: 36px;
  }
`;
