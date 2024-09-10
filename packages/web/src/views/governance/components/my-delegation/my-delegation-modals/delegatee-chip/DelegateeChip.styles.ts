import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const DelegateeChipWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  text-wrap: nowrap;
  padding: 4px 12px 4px 6px;
  gap: 8px;
  border-radius: 36px;
  border: 1px solid ${({ theme }) => theme.color.border12};
  background-color: ${({ theme }) => theme.color.background02};
  ${fonts.body9};
  color: ${({ theme }) => theme.color.text01};

  &.no-logo {
    padding: 4px 12px;
  }

  &.selected {
    background: ${({ theme }) => theme.color.hover02};
  }

  &:hover {
    background: ${({ theme }) => theme.color.hover02};
    cursor: pointer;
  }
`;