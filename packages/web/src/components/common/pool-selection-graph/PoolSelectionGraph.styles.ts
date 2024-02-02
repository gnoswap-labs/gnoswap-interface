import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const PoolSelectionGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;

  svg {
    overflow: overlay;
  }
    
  text {
    ${fonts.p4}
    color: ${({ theme }) => theme.color.text02};
  }

  .tooltip-container {
    position: absolute;
    pointer-events: none;

    .tooltip-wrapper {
      display: flex;
      flex-direction: column;
      width: 390px;
      background-color: ${({ theme }) => theme.color.background02};
      padding: 16px;
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
  }
  .domain {
    color: #596782;
  }
  .tick {
    text {
      ${fonts.p7}
      color: ${({ theme }) => theme.color.text04};
    }
  }

  .selection {
    stroke: none;
    fill-opacity: 1;
  }
`;

export const GraphWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  gap: 8px;
  min-width: 360px;
  .header {
    width: 100%;
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text04};
    ${mixins.flexbox("row", "center", "flex-start")}

    .token, .amount {
      width: 80px;
      margin-right: 8px;
    }
    .price {
      text-align: right;
      margin-left: 8px;
      flex: 1;
    }
  }
  .content {
    width: 100%;
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 8px;
      .item {
        height: 28px;
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text02};
        width: 100%;
        ${mixins.flexbox("row", "center", "flex-start")}
      }
      .logo {
        ${mixins.flexbox("row", "center", "flex-start")}
        gap: 8px;
        width: 80px;
        margin-right: 8px;
      }
      .amount {
        width: 80px;
        margin-right: 8px;
      }
      .price {
        text-align: right;
        margin-left: 8px;
        flex: 1;
      }
  }

`;