import styled from "@emotion/styled";

export const ScrollTopContainer = styled.div`
  position: relative;
`;

export const ScrollTopButton = styled.button`
  position: fixed;
  cursor: pointer;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.color.background04};
  bottom: 76px;
  right: 16px;
  border-radius: 8px;
  &:hover {
    background-color:  ${({ theme }) => theme.color.background04Hover};
  }
`;