import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const PoolGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;

  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  svg {
    rect {
      stroke: ${({ theme }) => theme.color.backgroundOpacity};
      &:hover {
        opacity: 0.4;
      }
    }
  }
`;

export const PoolGraphTooltipWrapper = styled.div`
  padding: 0;
  pointer-events: none;
  border-radius: 8px;

  &.disabled {
    display: none;
  }

  .tooltip-wrapper {
    display: flex;
    flex-direction: column;
    width: 390px;
    background-color: ${({ theme }) => theme.color.background02};
    align-items: flex-start;
    border-radius: 8px;
    gap: 8px;
    ${fonts.body12};
    line-height: 1em;

    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 16px;

      & > span {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

    .header {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text04};
      margin-bottom: 5px;
    }

    .content {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text02};
      gap: 8px;
    }

    .token {
      flex-shrink: 0;
      width: 80px;
      gap: 8px;

      img {
        width: 20px;
        height: 20px;
      }
    }

    .amount {
      flex-shrink: 0;
      width: 80px;

      & .hidden {
        display: inline;
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
        word-break: break-all;
      }
    }

    .price-range {
      width: 100%;
    }
  }
`;
