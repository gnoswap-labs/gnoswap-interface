import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

interface BarGraphWrapperProps {
  color?: string;
  hoverColor?: string;
  svgColor?: string;
}

export const BarGraphWrapper = styled.div<BarGraphWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;
  pointer-events: none;
  & > svg {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: visible;
    rect {
      pointer-events: auto;
      &:hover {
        fill: ${(props) =>
          props.svgColor === "default" ? ({ theme }) => theme.color.point : ""};
        opacity: ${(props) => (props.svgColor === "incentivized" ? 0.4 : 1)};
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
  top: ${(props) => `${props.y - 51}px`};
  left: ${(props) => `${props.x}px`};
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

export const IncentivizeGraphTooltipWrapper = styled.div<BarGraphTooltipWrapperProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  top: ${(props) => `${props.y - 140}px`};
  left: ${(props) => `${props.x}px`};
  padding: 16px;
  background: ${({ theme }) => theme.color.background02};
  border-radius: 8px;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  gap: 8px;
  z-index: ${Z_INDEX.modalTooltip};
  transform: translateX(-50%);
  .row {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    .token,
    .amount,
    .price {
      min-width: 80px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12}
    }
    .amount {
      margin: 0 16px 0 8px;
    }
    .price {
      min-width: 173px;
    }
  }
  .body {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    .token,
    .amount,
    .price {
      min-width: 80px;
      color: ${({ theme }) => theme.color.text02};
      ${fonts.body12}
    }
    .amount {
      margin: 0 16px 0 8px;
    }
    .price {
      min-width: 173px;
    }
    .token {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
  }
  ${media.mobile} {
    padding: 12px;
  }
`;
