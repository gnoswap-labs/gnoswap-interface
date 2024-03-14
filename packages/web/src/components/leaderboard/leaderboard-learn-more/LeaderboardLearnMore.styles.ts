import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LearnModeWrapper = styled.span`
  ${mixins.flexbox("row", "center", "center", false)};
  gap: 4px;
  bottom: 7px;
  top: 19px;
  cursor: pointer;

  color: ${({ theme }) => theme.color.text30};
  svg {
    * {
      fill: ${({ theme }) => theme.color.text30};
    }
  }

  ${media.mobile} {
    bottom: 2px;
    top: 9px;
  }
`;
