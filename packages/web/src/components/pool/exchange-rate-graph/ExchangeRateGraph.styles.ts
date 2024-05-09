import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ExchangeRateGraphWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background01};
  width: 430px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  gap: 16px;

  ${media.tablet} {
    max-width: 500px;
    width: 100%;
  }
`;

export const ExchangeRateGraphHeaderWrapper = styled.div`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
  ${mixins.flexbox("row")};

  .title {
    margin-right: 4px;
  }

  .tooltip-wrap {
    width: 16px;
    height: 16px;
    & * {
      ${mixins.flexbox("row", "center", "center")};
    }
    .tooltip-icon {
      width: 100%;
      height: 100%;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
`;

export const TooltipContentWrapper = styled.div`
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text02};
`;

export const LoadingExchangeRateChartWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  height: 246px;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  > div {
    width: 60px;
    height: 60px;
    &::before {
      width: 48px;
      height: 48px;
    }
    &::after {
      ${mixins.positionCenter()};
      content: "";
      border-radius: 50%;
      width: 48px;
      height: 48px;
      background-color: ${({ theme }) => theme.color.background15};
    }
  }
  ${media.mobile} {
    height: 224px;
  }
`;
