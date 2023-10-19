import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TokenChartGraphTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: auto;
  margin-bottom: 12px;
  ${media.mobile} {
    margin-bottom: 8px;
  }
  .chart-select-button {
    width: 60px;
    height: 37px;
  }
`;
