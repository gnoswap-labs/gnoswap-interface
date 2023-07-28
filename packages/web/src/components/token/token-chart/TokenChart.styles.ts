import styled from "@emotion/styled";

export const TokenChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.text01};
  background-color: ${({ theme }) => theme.color.background02};
  width: 100%;
  height: auto;
  padding: 36px;
  border-radius: 8px;

  .chart-tab-wrapper {
  }

  .chart-graph-wrapper {
  }
`;
