import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ToolTipAPRWrapper = styled.div`
  width: 268px;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  .title {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
  }
  .item {
    height: 28px;
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 8px;
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body12}

    .value {
      ${mixins.flexbox("row", "center", "flex-end")};
        gap: 8px;
    }
  }
`;
