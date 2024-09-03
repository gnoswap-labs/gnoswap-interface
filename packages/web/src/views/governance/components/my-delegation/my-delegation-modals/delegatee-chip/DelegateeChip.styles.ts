import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const DelegateeChipWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  text-wrap: nowrap;
  padding: 4px 12px 4px 6px;
  gap: 8px;
  border-radius: 36px;
  background: ${({ theme }) => theme.color.background05};
  ${fonts.body9};
  color: ${({ theme }) => theme.color.text02};

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