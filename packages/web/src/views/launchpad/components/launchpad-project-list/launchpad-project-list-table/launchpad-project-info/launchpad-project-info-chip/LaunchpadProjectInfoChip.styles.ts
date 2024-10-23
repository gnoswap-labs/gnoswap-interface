import styled from "@emotion/styled";
import { css } from "@emotion/react";
import mixins from "@styles/mixins";
import { PROJECT_STATUS_TYPE } from "@common/values";

interface ChipStyle {
  type: PROJECT_STATUS_TYPE;
}

export const ChipWrapper = styled.div<ChipStyle>`
  ${mixins.flexbox("row", "center", "center")}
  gap: 4px;
  padding: 4px 12px;
  border-radius: 36px;
  font-size: 12px;
  font-weight: 500;
  ${({ type, theme }) => {
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
        background: rgba(89, 103, 130, 0.25);
        color: ${theme.color.text05};
      `;
  }}
`;
