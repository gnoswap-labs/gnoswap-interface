import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { PROJECT_STATUS_TYPE } from "@common/values";

interface ActiveProjectCardWrapperProps {
  type: PROJECT_STATUS_TYPE;
}

export const ActiveProjectCardWrapper = styled.div<ActiveProjectCardWrapperProps>`
  ${mixins.flexbox("column", "flex-start", "center")};
  gap: 24px;
  position: relative;
  border-radius: 8px;
  padding: 36px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border: 1px solid var(--border-gradient, #869dff);
    background: ${({ theme }) =>
      theme.themeKey === "dark"
        ? theme.color.background06
        : theme.color.hover01};
  }
  ${media.mobile} {
    gap: 16px;
    padding: 16px;
    min-width: 0;
    max-width: 328px;
    height: 311px;
  }
`;
