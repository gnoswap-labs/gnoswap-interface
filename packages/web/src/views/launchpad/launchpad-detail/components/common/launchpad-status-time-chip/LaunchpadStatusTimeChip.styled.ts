import styled from "@emotion/styled";
import { css } from "@emotion/react";
import mixins from "@styles/mixins";
import { PROJECT_STATUS_TYPE } from "@common/values";

interface ChipStyle {
  type: PROJECT_STATUS_TYPE;
}

export const StatusTimeChipWrapper = styled.div<ChipStyle>`
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
    if (type === PROJECT_STATUS_TYPE.ONGOING)
      return css`
        background: rgba(22, 199, 138, 0.2);
        color: #16c78a;
      `;
    if (type === PROJECT_STATUS_TYPE.ENDED)
      return css`
        background: var(
          --background-opacity-7-global-gray-20-opacity-25,
          rgba(195, 210, 234, 0.25)
        );
        color: var(--text-05-white-gray-300-text-1, #90a2c0);
      `;
  }}
`;
