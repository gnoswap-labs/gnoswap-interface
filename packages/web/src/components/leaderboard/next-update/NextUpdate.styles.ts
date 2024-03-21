import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TooltipContent = styled.div`
  width: 282px;
  ${fonts.body13};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
`;

export const Flex = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
`;

export const Text10 = styled.p`
  color: ${({ theme }) => theme.color.text10};
`;

export const TextWrapper = styled.div`
  width: 185px;
  ${media.tablet} {
    width: 165px;
  }
  ${media.mobile} {
    width: 140px;
  }
`;

export const Height24 = styled.div`
  height: 24px;
  ${media.tablet} {
    height: auto;
  }
`;

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`;
