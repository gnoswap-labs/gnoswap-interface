import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const LineGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 319px;
  overflow: visible;
  ${media.mobile} {
    height: 263px;
  }
  & svg {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 319px;
    overflow: visible;
    ${media.mobile} {
      height: 263px;
    }
  }
`;

interface LineGraphTooltipWrapperProps {
  x: number;
  y: number;
}

export const LineGraphTooltipWrapper = styled.div<LineGraphTooltipWrapperProps>`
  position: absolute;
  top: ${props => `${props.y}px`};
  left: ${props => `${props.x}px`};
  display: flex;
  flex-direction: column;
  min-width: 148px;
  height: auto;
  padding: 6px 8px;
  background: ${({ theme }) => theme.color.background02};
  border-radius: 4px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
  overflow: visible;
  gap: 5px;
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
