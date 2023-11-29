import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TokenChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.text01};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  width: 100%;
  height: auto;
  padding: 23px;
  border-radius: 8px;
  ${media.mobile} {
    background-color: transparent;
    border: none;
    padding: 0;
    gap: 16px;
  }
  .chart-tab-wrapper {
  }

  .chart-graph-wrapper {
  }
`;
