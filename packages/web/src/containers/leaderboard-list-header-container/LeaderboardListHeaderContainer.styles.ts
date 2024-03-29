import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text04};
`;
