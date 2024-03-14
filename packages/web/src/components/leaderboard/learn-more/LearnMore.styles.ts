import styled from "@emotion/styled";

export const Flex = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  cursor: pointer;
`;

export const Text30 = styled.span`
  color: ${({ theme }) => theme.color.text30};
`;
