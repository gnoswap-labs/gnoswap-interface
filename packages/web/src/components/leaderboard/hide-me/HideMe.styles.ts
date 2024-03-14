import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const Flex = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
`;

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`;
