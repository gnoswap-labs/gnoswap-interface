import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { inputStyle } from "../../components/remove-liquidity/RemoveLiquidity.styles";

export const RemoveLiquiditySelectListWrapper = styled.div`
  ${({ theme }) => inputStyle(theme)};
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 4px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity};
  padding: 16px;
  border-radius: 8px;
  .checked-all-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 32px;
    padding: 0px 15px;
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12};
    label {
      gap: 8px;
    }
    .custom-label {
      margin-left: 8px;
    }
    .wrapper-check-label {
      ${mixins.flexbox("row", "center", "flex-start")}
    }
    ${media.mobile} {
      padding: 0px 11px;
    }
  }
  
  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
    width: 100%;
  }

  label {
    line-height: 30px;
    justify-content: center;
    align-items: center;
  }

  label:before {
    display: block;
    content: " ";
  }
  .no-position {
    ${mixins.flexbox("row", "center", "center")};
    height: 176px;
    margin-top: 12px;
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
  }
`;
