import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const LineGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 321px;
  overflow: visible;
  ${media.mobile} {
    height: 252px;
  }
  & svg {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 321px;
    overflow: visible;
    .center-line {
      transform: translateY(50%) !important;
    }
    ${media.mobile} {
      height: 252px;
    }
    .y-axis-number {
      ${fonts.p6}
    }
  }
`;

export const LineGraphTooltipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 106px;
  height: auto;
  background: ${({ theme }) => theme.color.background02};
  border-radius: 4px;
  overflow: visible;
  gap: 8px;
  ${fonts.p4};

  & .tooltip-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: space-between;
    ${fonts.body9}
    color: ${({ theme }) => theme.color.text02};
  }

  & .tooltip-body {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    .time {
      margin-left: 40px;
    }
  }
`;
