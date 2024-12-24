import styled from "@emotion/styled";

export const SwapInfoChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;
