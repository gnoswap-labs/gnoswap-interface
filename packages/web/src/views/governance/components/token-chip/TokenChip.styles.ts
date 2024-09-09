import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const TokenChipWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  padding: 4px 12px 4px 6px;
  margin-left: 8px;
  gap: 8px;
  border-radius: 36px;
  background: ${({ theme }) => theme.color.background13};
  ${fonts.body9};
  color: ${({ theme }) => theme.color.text02};
`;