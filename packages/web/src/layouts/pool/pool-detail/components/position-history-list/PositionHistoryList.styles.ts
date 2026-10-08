import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PositionHistoryListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
`;

export const PositionHistoryPaginationWrapper = styled.div`
  padding: 16px 0 24px;

  ${media.mobile} {
    padding-bottom: 12px;
  }
`;
