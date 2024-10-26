import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const LaunchpadPoolListWrapper = styled.div`
  ${mixins.flexbox("row", "center", "cetner")}
  width: 100%;
  gap: 16px;
  .card {
    width: 100%;
  }
`;
