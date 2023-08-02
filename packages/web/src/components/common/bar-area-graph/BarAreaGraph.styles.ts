import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const BarAreaGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;

  svg.selector {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .area {
      background: linear-gradient(
        270deg,
        rgba(0, 205, 46, 0.2) 0%,
        rgba(255, 2, 2, 0.2) 100%
      );
    }
  }
`;

interface BarAreaGraphTooltipWrapperProps {
  x: number;
  y: number;
}

export const BarAreaGraphTooltipWrapper = styled.div<
  BarAreaGraphTooltipWrapperProps
>`
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
