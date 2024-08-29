import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const BalanceTooltipContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 250px;
  gap: 8px;
  ${fonts.body12};
  ${media.mobile} {
    gap: 4px;
    ${fonts.p2};
  }
  .list {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 4px 0px;
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      flex-shrink: 0;
      .token-logo {
        width: 20px;
        height: 20px;
      }
    }
  }
  .title {
    color: ${({ theme }) => theme.color.text04};
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
`;
