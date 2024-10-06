import styled from "@emotion/styled";
import { css } from "@emotion/react";
import mixins from "@styles/mixins";
import { PROJECT_STATUS_TYPE } from "./LaunchpadActiveProjectCardTimeChip";

interface ChipStyle {
  type: PROJECT_STATUS_TYPE;
}

export const ActiveProjectCardTimeChip = styled.div<ChipStyle>`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 4px;
  padding: 4px 12px;
  border-radius: 36px;
  font-size: 12px;
  font-weight: 500;
  ${({ type }) => {
    if (type === PROJECT_STATUS_TYPE.UPCOMING)
      return css`
        background: rgba(0, 89, 255, 0.2);
        color: var(--Light-Palette-Blue, #007aff);
      `;
    if (type === PROJECT_STATUS_TYPE.END)
      return css`
        background: rgba(22, 199, 138, 0.2);
        color: #16c78a;
      `;
  }}
`;
