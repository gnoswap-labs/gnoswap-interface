import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

interface BarGraphWrapperProps {
  color?: string;
  hoverColor?: string;
}

export const BarGraphWrapper = styled.div<BarGraphWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;

  & svg {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    overflow: visible;

    line {
      stroke: ${({ theme, color }) => color || theme.color.background04Hover};
      cursor: pointer;

      &:hover {
        stroke: ${({ theme, hoverColor }) => hoverColor || theme.color.point};
      }
    }
  }
`;

interface BarGraphTooltipWrapperProps {
  x: number;
  y: number;
}

export const BarGraphTooltipWrapper = styled.div<BarGraphTooltipWrapperProps>`
  position: absolute;
  top: ${props => `${props.y}px`};
  left: ${props => `${props.x}px`};
  display: flex;
  flex-direction: column;
  width: 157px;
  height: auto;
  padding: 6px 8px;
  background: ${({ theme }) => theme.color.background05};
  border-radius: 4px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
  overflow: visible;
  ${fonts.p4};

  & .tooltip-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: space-between;
  }

  & .tooltip-body {
    color: ${({ theme }) => theme.color.point};
  }
`;
