import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TvlChartWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  padding: 23px;
  gap: 31px;
  ${media.mobile} {
    padding: 11px 23px 11px 11px;
    gap: 16px;
  }
`;

export const ChartWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 12px;
  ${media.mobile} {
    gap: 12px;
  }
`;

export const LoadingTVLChart = styled.div`
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