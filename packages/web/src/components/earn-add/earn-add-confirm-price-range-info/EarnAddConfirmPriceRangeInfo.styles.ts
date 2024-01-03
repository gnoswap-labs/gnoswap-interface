import styled from "@emotion/styled";
import { EarnAddConfirmContentSection } from "../earn-add-confirm/EarnAddConfirm.styles";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const EarnAddConfirmPriceRangeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 2px;
  .range-title {
    ${mixins.flexbox("row", "center", "space-between")};
    margin-bottom: 6px;
    p {
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text10};
    }
    > div {
      span {
        ${fonts.p4}
      }
    }
  }


  .price-range-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 2px;
  }
`;

export const EarnAddConfirmPriceRangeInfoSection = styled(
  EarnAddConfirmContentSection,
)`
  gap: 16px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text10};

  &.range-section {
    padding: 15px 7px;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.color.background20};
    .amount {
      ${fonts.body4}
      color: ${({ theme }) => theme.color.text01};
      max-width: 180px;
      overflow: auto;
    }

    .label {
      ${fonts.p4}
    }
    span {
      color: ${({ theme }) => theme.color.text04};
      ${media.mobile} {
        &:first-of-type {
          ${fonts.body12}
        }
      }
    }
    ${media.mobile} {
      padding: 11px 7px;
    }
  }
  .swap-value {
    ${mixins.flexbox("flex", "center", "flex-end")}
    gap: 4px;
    > div {
      cursor: pointer;
    }
    svg * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    svg:hover * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
  
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .key {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
  }
  .icon-swap {
    width: 16px;
    height: 16px;
    cursor: pointer;
    &:hover {
      svg * {
        fill: ${({ theme }) => theme.color.icon15};
      }
    }
  }
  .value {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body12}
    gap: 4px;
    color: ${({ theme }) => theme.color.text10};
    svg * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  .title-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;

    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
  ${media.mobile} {
    gap: 8px;
    .key, .value {
      ${fonts.p2}
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
