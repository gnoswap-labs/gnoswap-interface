import styled from "@emotion/styled";

export const Content = styled.div`
  color: ${({ theme }) => theme.color.text15};
  background-color: ${({ theme }) => theme.color.background14};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
`;
