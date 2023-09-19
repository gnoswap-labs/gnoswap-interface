import mixins from "@styles/mixins";

import styled from "@emotion/styled";

export const SelectPairWrapper = styled.div`
  width: 100%;
  height: 40px;
  gap: 16px;
  ${mixins.flexbox("row", "center", "space-between", false)}
`;
