import styled from "@emotion/styled";

export const Flex = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  cursor: pointer;

  * {
    color: ${({ theme }) => theme.color.text04};
    fill: ${({ theme }) => theme.color.icon03};
  }
  &:hover {
    * {
      color: ${({ theme }) => theme.color.text03};
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const Text30 = styled.span`
  color: ${({ theme }) => theme.color.text30};
`;

export const Anchor = styled.a``;
