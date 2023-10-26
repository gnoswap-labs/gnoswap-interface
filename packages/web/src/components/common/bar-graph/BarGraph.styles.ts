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
    height: 100%;
    overflow: visible;
    rect {
      &:hover {
        fill: ${({ theme }) => theme.color.point};
      }
    }
  }
`;

export const BarLineWrapper = styled.line`
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

interface BarGraphTooltipWrapperProps {
  x: number;
  y: number;
}

export const BarGraphTooltipWrapper = styled.div<BarGraphTooltipWrapperProps>`
  position: absolute;
  top: ${props => `${props.y - 51}px`};
  left: ${props => `${props.x}px`};
  display: flex;
  flex-direction: column;
  min-width: 220px;
  height: auto;
  padding: 6px 8px;
  background: ${({ theme }) => theme.color.background02};
  border-radius: 4px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
  overflow: visible;
  gap: 5px;
  transform: translateX(-48%);
  ${fonts.p4};

  & .tooltip-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
    color: ${({ theme }) => theme.color.point};
  }

  & .tooltip-body {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
    .date {
      margin-right: 3px;
    }
  }
`;
