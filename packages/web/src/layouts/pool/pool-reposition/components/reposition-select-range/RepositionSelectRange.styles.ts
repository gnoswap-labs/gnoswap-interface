import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { RepositionContentBoxStyle } from "../reposition-content-box/RepositionContnetBox.style";

interface Props {
  open?: boolean;
}

export const RepositionSelectRangeWrapper = styled.div<Props>`
  ${({ theme }) => RepositionContentBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: ${({ open }) => (!open ? "6px" : "16px")};
  h5 {
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12}
  }

  ${media.mobile} {
    gap: 8px;
  }
  .common-bg {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
  }
  .select-position {
    margin-top: 14px;
    padding: 11px 15px;
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    ${media.mobile} {
      margin-top: 10px;
    }
  }
  .header-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 24px;
    cursor: pointer;
    position: relative;
    &.default-cursor {
      cursor: default;
      &.disable-text {
        h5 {
          color: ${({ theme }) => theme.color.text04};
        }
      }
    }
    h5 {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text10};
    }
    .setting-modal {
      top: calc(100% + 4px);
    }
    &-title {
      ${mixins.flexbox("row", "center", "flex")};

      gap: 4px;
      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon15};
        }
      }
    }
    .fee-tier-bad {
      border: 1px solid ${({ theme }) => theme.color.border19};
      color: ${({ theme }) => theme.color.text26};
      background: ${({ theme }) => theme.color.background22};
    }
  }
  > div {
    &:nth-of-type(2) {
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
