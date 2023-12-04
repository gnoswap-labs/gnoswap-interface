import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const VolumeChartWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  padding: 23px;
  ${media.mobile} {
    padding: 11px 11px 11px 11px;
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

export const LoadingVolumnChart = styled.div`
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
      background-color: ${({ theme }) => theme.color.background01};
    }
  }
  ${media.mobile} {
    height: 224px;
  }
`;