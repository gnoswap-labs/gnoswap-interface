import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const SwapTokenChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
`;

export const LoadingChart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  > div {
    &::before {
      background-color: ${({ theme }) => theme.color.background01};
    }
    &::after {
      ${mixins.positionCenter()};
      content: "";
      border-radius: 50%;
      width: 60px;
      height: 60px;
      @media (min-width: 769px) {
        background-color: ${({ theme }) => theme.color.background15};
      }
    }
  }
  ${media.mobile} {
    height: 282px;
  }
`;

export const ChartNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
`;
