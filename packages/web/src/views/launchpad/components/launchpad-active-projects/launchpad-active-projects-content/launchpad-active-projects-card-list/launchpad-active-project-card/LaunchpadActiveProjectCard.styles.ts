import styled from "@emotion/styled";
import { css } from "@emotion/react";
import mixins from "@styles/mixins";

import { PROJECT_STATUS_TYPE } from "@common/values";

interface ActiveProjectCardWrapperProps {
  type: PROJECT_STATUS_TYPE;
}

export const ActiveProjectCardWrapper = styled.div<ActiveProjectCardWrapperProps>`
  ${mixins.flexbox("column", "flex-start", "center")};
  gap: 24px;
  position: relative;
  min-width: 322px;
  border-radius: 8px;
  padding: 36px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${({ type }) =>
    type === PROJECT_STATUS_TYPE.UPCOMING
      ? css`
          cursor: default;
          pointer-events: none;
        `
      : css`
          cursor: pointer;
          &:hover {
            border: 1px solid var(--border-gradient, #869dff);
            background: var(--Global-Gray-Gray600, #141a29);
          }
        `}
`;
