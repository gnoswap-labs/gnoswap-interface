import styled from "@emotion/styled";

export const PoolTierChipWrapper = styled.div`
  color: ${({ theme }) => theme.color.text06};
  background: ${({ theme }) => theme.color.background03};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.color.border03};
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 400;
`;
