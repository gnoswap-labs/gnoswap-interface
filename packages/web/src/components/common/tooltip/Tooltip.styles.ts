import styled from "@emotion/styled";

export const Content = styled.div`
  background-color: ${({ theme }) => theme.colors.brand90};
  color: ${({ theme }) => theme.colors.gray10};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
`;
