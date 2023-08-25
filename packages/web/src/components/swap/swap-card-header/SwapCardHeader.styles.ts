import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SwapCardHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;

  h2 {
    ${fonts.h6};
    ${media.mobile} {
      ${fonts.body9};
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .button-wrap {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 12px;
  }

  .setting-wrap {
    ${mixins.flexbox("row", "center", "center")};
    position: relative;
    width: 24px;
    height: 24px;
    cursor: pointer;
    .setting-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    .setting-icon:hover * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const SettingMenuButton = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
`;

export const CopyTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: -65px;
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 115px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text15};
    background-color: ${({ theme }) => theme.color.background14};
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background14};
  }
`;
