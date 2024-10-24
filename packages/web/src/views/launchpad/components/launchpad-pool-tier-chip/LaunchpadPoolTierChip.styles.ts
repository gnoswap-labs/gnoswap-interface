import styled from "@emotion/styled";

export const PoolTierChipWrapper = styled.div`
  color: ${({ theme }) =>
    theme.themeKey === "dark" ? theme.color.text06 : theme.color.text04};
  background: ${({ theme }) =>
    theme.themeKey === "dark"
      ? theme.color.background03
      : theme.color.background11};
  border-radius: 4px;
  border: 1px solid
    ${({ theme }) =>
      theme.themeKey === "dark" ? theme.color.border03 : theme.color.border01};
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 400;
`;
