import styled from "@emotion/styled";

import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AdditionalInfoWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  padding: 0 24px 0 16px;
  gap: 16px;
  ${media.tablet} {
    width: 100%;
    margin: 16px auto 0;
    padding: 0;
  }
`;

export const AdditionalInfoDummy = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  padding: 0 24px 0 16px;
  width: 470px;
  ${media.tablet} {
    width: 100%;
    max-width: 500px;
  }
}`;