import styled from "@emotion/styled";

export const SwapInfoTransactionListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  padding: 16px 16px 0 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;
