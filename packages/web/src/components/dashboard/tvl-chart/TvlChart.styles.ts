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
