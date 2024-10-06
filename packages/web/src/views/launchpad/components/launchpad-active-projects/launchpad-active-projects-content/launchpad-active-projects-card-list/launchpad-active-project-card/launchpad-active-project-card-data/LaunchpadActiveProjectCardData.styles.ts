import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ActiveProjectCardDataWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  gap: 2px;
  width: 100%;
  .data-box {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
  }
`;
