import mixins from "@styles/mixins";

import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

interface Props {
  isTokenA?: boolean;
  isTokenB?: boolean;
}

export const SelectPairWrapper = styled.div<Props>`
  width: 100%;
  height: 40px;
  gap: 16px;
  ${mixins.flexbox("row", "center", "space-between", false)}
  > div {
    height: 40px;
    padding: 5px 10px 5px 12px;
    > span {
      ${fonts.body7}
    }
    div {
      padding-right: 4px;
    }
    .token-logo {
      width: 30px;
      height: 30px;
    }
    .arrow-icon {
      width: 20px;
      height: 20px;
    }
  }
  .change-select-pair-A {
    padding: ${({ isTokenA }) => {
      return isTokenA ? "5px 10px 5px 6px" : "0px 10px 0px 12px";
    }};
  }

  .change-select-pair-B {
    padding: ${({ isTokenB }) => {
      return isTokenB ? "5px 10px 5px 6px" : "0px 10px 0px 12px";
    }};
  }

`;
