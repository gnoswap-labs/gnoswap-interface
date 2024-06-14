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
    props.svgColor === "default" ? ({ hoverColor }) => hoverColor : ""};
        opacity: ${(props) => (props.svgColor === "incentivized" ? 0.4 : 1)};
        + path {
          fill: ${(props) =>
    props.svgColor === "default" ? ({ hoverColor }) => hoverColor : ""};
          opacity: ${(props) => (props.svgColor === "incentivized" ? 0.4 : 1)};
        }
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

export const BarGraphTooltipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 256px;
  height: auto;
  background: ${({ theme }) => theme.color.background02};
  border-radius: 4px;
  gap: 8px;

  ${fonts.p4};

  & .tooltip-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 29px;
    justify-content: space-between;
    ${fonts.body9}
    color: ${({ theme }) => theme.color.text02};
    .label {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.body12}
    }
  }

  & .tooltip-body {
    ${fonts.body12};
    ${mixins.flexbox("row", "center", "space-between")}
    color: ${({ theme }) => theme.color.text04};
    .time {
      margin-left: 40px;
      ${media.tablet} {
        display: none;
      }
    }
  }
`;

export const IncentivizeGraphTooltipWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background: ${({ theme }) => theme.color.background02};
  gap: 8px;
  z-index: ${Z_INDEX.modalTooltip};
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
