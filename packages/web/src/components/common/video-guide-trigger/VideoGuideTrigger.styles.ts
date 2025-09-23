import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const VideoGuideTriggerWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start", false)};
  flex-shrink: 0;
  gap: 4px;
  cursor: pointer;

  color: ${({ theme }) => theme.color.text04};
  ${fonts.body11};
  svg {
    width: 16px;
    height: 16px;
  }
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  &:hover {
    color: ${({ theme }) => theme.color.text03};
    svg {
      * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }
`;
