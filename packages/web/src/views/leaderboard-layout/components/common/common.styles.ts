import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { ThemeColorType } from "@styles/ThemeTypes";

export const FontSize16 = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 20.8px;

  ${media.tablet} {
    font-size: 14px;
    font-weight: 400;
    line-height: 18.2px;
  }

  ${media.mobile} {
    font-size: 12px;
    font-weight: 400;
    line-height: 15.6px;
  }
`;

export const Box = styled.div``;

export const P = styled.p<{ color: keyof ThemeColorType }>`
  color: ${({ theme, color }) => theme.color[color]};
`;

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`;

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
