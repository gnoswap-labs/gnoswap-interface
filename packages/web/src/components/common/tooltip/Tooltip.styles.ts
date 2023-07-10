import styled from "@emotion/styled";

export const Content = styled.div`
  background-color: ${({ theme }) => theme.color.background10};
  color: ${({ theme }) => theme.color.text02};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
`;
