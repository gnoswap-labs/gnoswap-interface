import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

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

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  .search-icon {
    width: 24px;
    height: 24px;
    * {
      fill: ${({ theme }) => theme.color.icon08};
    }
  }
  .search-icon:hover {
    * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }
`;

export const P = styled.p`
  color: ${({ theme }) => (theme.themeKey === "dark" ? "#596782" : "#90A2C0")};
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

export const priceWarningStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 2px;

  color: ${theme.themeKey === "dark" ? theme.color.text05 : theme.color.text22};
  path {
    fill: ${theme.themeKey === "dark" ? theme.color.text05 : theme.color.text22};
  }
`;
