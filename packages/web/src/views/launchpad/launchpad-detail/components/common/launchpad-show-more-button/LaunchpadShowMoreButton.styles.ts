import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const ShowMoreWrapper = styled.button`
  ${mixins.flexbox("row", "center", "flex-start", false)}
  gap: 4px;
  ${fonts.body11};
  color: ${({ theme }) => theme.color.text04};
  .icon-load {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  &:hover {
    span {
      color: ${({ theme }) => theme.color.text03};
    }
    transition: all 0.3s ease;
    svg {
      * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }
`;
