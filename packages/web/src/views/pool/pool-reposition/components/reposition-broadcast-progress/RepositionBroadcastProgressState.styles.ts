import { fonts } from "@constants/font.constant";
import { keyframes } from "@emotion/css";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

const Rotate = keyframes`
from { 
    -webkit-transform: rotate(0deg); 
} to { 
    -webkit-transform: rotate(360deg); 
}
`;

export const RepositionBroadcastProgressStateWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: fit-content;
  gap: 8px;

  .description {
    height: 18px;
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body13};

    a {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .icon-state {
    ${mixins.flexbox("column", "center", "center")};
    width: 16px;
    height: 16px;
    align-self: center;

    &.rotate {
      animation: ${Rotate} 1s ease-out infinite;
    }
  }

  ${media.mobile} {
    .description {
      ${fonts.p2};
    }
  }
`;
