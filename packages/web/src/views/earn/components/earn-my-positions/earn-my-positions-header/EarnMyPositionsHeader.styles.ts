import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PositionsWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.h5}
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${fonts.h6}
    gap: 12px;
  }
  .header-content {
    width: auto;
    ${mixins.flexbox("row", "center", "space-between")};
    margin-right: 24px;
    .switch-button {
      display: none;
    }
    ${media.mobile} {
      width: 100%;
      .switch-button {
        display: inline-flex;
      }
    }

    h2 {
      display: flex;
      flex-direction: row;
      align-items: center;

      button {
        display: inline-flex;
        height: 24px;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
      }
      .name {
        background: ${({ theme }) => theme.color.text32};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
      }
    }
  }
  .button-wrapper {
    ${mixins.flexbox("row", "center", "flex-end")};
    gap: 8px;
    white-space: nowrap;
    .switch-button {
      margin-right: 28px;
    }
    ${media.mobile} {
      width: 100%;
      button {
        width: 50%;
      }
      .switch-button {
        display: none;
      }
    }
  }
`;

export const HeaderTextWrapper = styled.h2`
  white-space: nowrap;
`;
