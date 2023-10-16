import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const SwapButtonTooltipWrap = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 300px;
  height: 123px;
  padding: 16px;
  gap: 8px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text15};
  background-color: ${({ theme }) => theme.color.background14};

  .tooltip-list {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    padding: 4px 0px;
  }
`;

export const IconWrap = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  cursor: pointer;
  .icon-info {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon05};
    }
  }
`;
