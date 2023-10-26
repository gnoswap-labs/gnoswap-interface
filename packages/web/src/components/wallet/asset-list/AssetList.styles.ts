import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AssetListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 24px;
  ${media.tabletMiddle} {
    gap: 8px;
  }
  ${media.mobile} {
    gap: 8px;
  }
`;
