import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { TAB_SIZE } from "./ChartScopeSelectTab";

interface ChartScopeSelectTabWrapperProps {
  $hasBorder?: boolean;
  size: TAB_SIZE;
}

export const ChartScopeSelectTabWrapper = styled.div<ChartScopeSelectTabWrapperProps>`
  ${mixins.flexbox("row", "center", "center")};

  ${(props) =>
          props.$hasBorder ? ({ theme }) => theme.color.border01 : ""}
  .tab-button {}
  .tab-button {
    ${fonts.p6};
    width: ${(props) => {
      switch (props.size) {
        case "SMALL": 
          return "50px";
        case "MEDIUM":
        default:
          return "60px";
      }
    }};
    height: ${(props) => {
      switch (props.size) {
        case "SMALL": 
          return "21px";
        case "MEDIUM":
        default:
          return "37px";
      }
    }};
    padding: 0px 8px;
    ${media.mobile} {
      flex: 1;
      ${fonts.body12};
      padding: 4px 24px;
      height: 26px;
    }
  }
`;
