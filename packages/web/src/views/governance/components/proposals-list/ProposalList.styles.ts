import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ProposalListWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 16px;
`;
