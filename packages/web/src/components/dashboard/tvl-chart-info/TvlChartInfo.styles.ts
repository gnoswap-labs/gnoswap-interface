import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const TvlChartInfoWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  background-color: ${({ theme }) => theme.color.background01};
  border-radius: 8px;
  padding: 24px 24px 23px 24px;
  gap: 16px;
  width: 100%;
  height: 260px;
`;

export const ChartLayout = styled.div`
  width: 100%;
  height: 180px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;

export const TimeLineWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};\
  width: 100%;
  height: 17px;
`;
