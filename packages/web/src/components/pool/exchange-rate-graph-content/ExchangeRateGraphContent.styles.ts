import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ExchangeRateGraphContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  padding: 0 0 12px 0;
  ${media.mobile} {
    padding: 0 0 4px 0;
  }

  .data-wrapper {
    width: 100%;
    ${mixins.flexbox("column", "center", "end")};
    align-items: end;
    .graph-wrap {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
    }

    .graph {
      height: 204px;
      cursor: default;
      & svg {
        height: 204px;
        .line-chart-g {
          transform: translateY(24px);
        }
      }
    }
  }

  .yaxis-wrapper {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;

    span {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const ExchangeRateGraphXAxisWrapper = styled.div<{ innerWidth: string }>`
  width: 100%;
  ${mixins.flexbox("row", "center", "end")}
  .exchange-rate-graph-xaxis {
    width: ${({ innerWidth }) => innerWidth};
    ${mixins.flexbox("row", "center", "space-between")};
    height: 17px;
    flex-shrink: 0;
    padding: 0 12px;
    ${media.mobile} {
      margin-top: 4px;
      height: 13px;
      padding: 0 4px;
    }
    ${fonts.p6};
    color: ${({ theme }) => theme.color.text04};
    text-align: center;
    span {
      ${media.mobile} {
        ${fonts.p7};
      }
      color: ${({ theme }) => theme.color.text04};
    }
    &.single-point{
      ${mixins.flexbox("row", "center", "center")}
    }
  }
`;

