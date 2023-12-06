import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SwapButtonTooltipWrap = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 300px;
  gap: 8px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  ${media.mobile} {
    gap: 4px;
  }
  .tooltip-list {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    padding: 4px 0px;
  }
`;

export const IconWrap = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  .icon-info {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;
