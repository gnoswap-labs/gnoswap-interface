import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const EarnAddLiquidityWrapper = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  color: ${({ theme }) => theme.color.text02};
  width: 500px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: ${({ theme }) => theme.color.shadow01};
  padding: 24px;
  .button-submit {
    height: 57px;
    span {
      ${fonts.body7};
    }
  }
  h3 {
    ${fonts.h6}
    ${media.mobile} {
      ${fonts.body9};
    }
  }
  .select-content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 4px;
    width: 100%;
    position: relative;
    .change-select-pair-A,
    .change-select-pair-B {
      .missing-logo {
        width: 30px;
        height: 30px;
        padding: 0;
      }
    }

    .dim-content {
      position: absolute;
      top: 116px;
      height: calc(100% - 116px);
      width: 100%;
      left: 0;
      background: ${({ theme }) => theme.color.backgroundOpacity5};
      border-radius: 8px;
      ${media.mobile} {
        top: 100px;
        height: calc(100% - 100px);
      }
    }
  }

  .selector-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 15px;
    gap: 16px;

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
    }
    .liquity-enter-amount {
      .token {
        > div {
          height: 34px;
        }
      }
    }
    .fee-tier-bad {
      border: 1px solid ${({ theme }) => theme.color.border19};
      color: ${({ theme }) => theme.color.text26};
      background: ${({ theme }) => theme.color.background22};
    }
    &-fee-tier {
      padding-bottom: 0;
    }
    &-price-range {
      gap: 8px;
    }
  }
  .amount-input-wrapper {
    position: relative;
    .dim-content-4 {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      left: 0;
      background: ${({ theme }) => theme.color.backgroundOpacity8};
      border-radius: 8px;
    }
  }

  .setting-button {
    width: 24px;
    height: 24px;
    .setting-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    .setting-icon:hover * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
  .btn-one-click {
    cursor: pointer;
    color: ${({ theme }) => theme.color.text03};
    width: 100%;
    ${mixins.flexbox("row", "center", "center")};
    gap: 4px;
    ${fonts.body12}
    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
    &:hover {
      color: ${({ theme }) => theme.color.text07};
      svg {
        * {
          fill: ${({ theme }) => theme.color.icon06};
        }
      }
    }
  }
  ${media.mobile} {
    width: 100%;
    margin: 0 auto;
    max-width: 500px;
    padding: 15px;
    gap: 12px;
    .selector-wrapper {
      gap: 8px;
      padding: 11px;
    }
    .button-submit {
      height: 41px;
      span {
        ${fonts.body9};
      }
    }
    .btn-one-click {
      ${fonts.p4}
    }
  }
`;

export const OutOfRangeWrapper = styled.div`
  padding: 12px 16px;
  gap: 8px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity4};
  color: ${({ theme }) => theme.color.text08};
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  border-radius: 8px;
  ${fonts.body12}
  div {
    ${mixins.flexbox("row", "center", "flex-start")}
    svg {
      width: 16px;
      height: auto;
      * {
        fill: ${({ theme }) => theme.color.text08};
      }
    }
    gap: 8px;
    font-weight: 600;
  }
  ${media.mobile} {
    ${fonts.p2}
  }
`;
