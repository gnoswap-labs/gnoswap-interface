import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TvlChartGraphWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  padding: 0 0 12px 0;
  ${media.mobile} {
    padding: 0 0 4px 0;
  }

  .data-wrapper {
    width: 100%;
    .graph-wrap {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
    }

    .graph {
      height: 204px;
      border-bottom: 1px solid ${({ theme }) => theme.color.border02};
      cursor: default;
      & svg {
        height: 204px;
        .line-chart-g {
          transform: translateY(24px);
        }
      }
    }

    .xaxis-wrapper {
      ${mixins.flexbox("row", "center", "space-between")};
      &.center {
        ${mixins.flexbox("row", "center", "center")};
      }
      position: relative;
      width: 100%;
      height: 17px;
      flex-shrink: 0;
      margin-top: 13px;
      padding: 0 12px;
      ${media.mobile} {
        margin-top: 4px;
        height: 13px;
        padding: 0 4px;
      }
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
      text-align: center;
      span {
        ${fonts.body12};
        ${media.mobile} {
          ${fonts.p7};
        }
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }

  .yaxis-wrapper {
    display: flex;
    flex-direction: column-reverse;
    width: 24px;
    margin-left: 15px;
    margin-top: -10px;
    margin-bottom: 30px;
    justify-content: space-evenly;

    span {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const TokenChartGraphXLabel = styled.span<{
  x: number;
}>`
  position: absolute;
  display: block;
  min-width: 80px;
  left: ${({ x }) => `${x}px`};
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};
  transform: translate(-50%, 0);
  text-align: center;
  overflow: visible;
  word-break: keep-all;
  white-space: nowrap;

  ${media.mobile} {
    ${fonts.p7};
  }
`;

