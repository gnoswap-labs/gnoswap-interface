import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ActiveProjectCardWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  gap: 24px;
  position: relative;
  min-width: 322px;
  border-radius: 8px;
  padding: 36px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  &:hover {
    border: 1px solid var(--border-gradient, #869dff);
    background: var(--Global-Gray-Gray600, #141a29);
  }
`;
