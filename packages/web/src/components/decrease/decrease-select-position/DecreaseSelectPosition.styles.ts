import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { media } from "@styles/media";
import { DecreaseLiquidityBoxStyle } from "../decrease-liquidity/DecreaseLiquidity.styles";

interface Props {
  isDisabled?: boolean;
}

export const DecreaseSelectPositionWrapper = styled.div<Props>`
  ${({ theme }) => DecreaseLiquidityBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  .header-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    position: relative;
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
  }
  h5 {
    color: ${({ isDisabled, theme }) => {
      return isDisabled ? theme.color.text04 : theme.color.text10;
    }};
    ${fonts.body12}
  }

  ${media.mobile} {
    gap: 2px;
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
  .decrease-bg {
    padding: 15px 15px 24px 15px;
    ${media.mobile} {
      padding: 15px 15px 20px 15px;
    }
    ${mixins.flexbox("column", "flex-start", "flex-start")};
  }
  .pool-select-wrapper {
    flex: 1;
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body9}
    gap: 5px;
  }
  .min-max-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    gap: 2px;
  }
  .min {
    padding: 16px 0;
    flex: 1;
    ${mixins.flexbox("column", "center", "center")};
    gap: 8px;
    p {
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text04};

      &.value {
        ${fonts.body4}
        color: ${({ theme }) => theme.color.text01};
      }
    }
    .convert-value {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
      ${fonts.p4}
    }
    ${media.mobile} {
      padding: 12px 0;
    }
  }
  .deposit-ratio {
    padding: 16px;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 16px;
    > div {
      width: 100%;
      ${mixins.flexbox("row", "center", "space-between")};
      > div {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        svg {
          width: 16px;
          height: 16px;
        }
        svg * {
          fill: ${({ theme }) => theme.color.icon03};
        }
        svg:hover * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
      .label {
        color: ${({ theme }) => theme.color.text04};
        ${fonts.body12}
        ${media.mobile} {
          ${fonts.p2}
        }
      }
      .value {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        color: ${({ theme }) => theme.color.text10};
        ${fonts.body12}
        ${media.mobile} {
          ${fonts.p2}
        }
      }
    }
    ${media.mobile} {
      gap: 8px;
    }
  }
  .increase-amount-wrapper {
    position: relative;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 2px;
    .arrow {
      ${mixins.flexbox("row", "center", "center")};
      ${mixins.positionCenter()};
      width: 100%;

      .shape {
        ${mixins.flexbox("row", "center", "center")};
        width: 40px;
        height: 40px;
        background-color: ${({ theme }) => theme.color.background01};
        border: 1px solid ${({ theme }) => theme.color.border02};
        border-radius: 50%;

        .add-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon02};
          }
        }
      }
    }
  }
  .decrease-percent {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    > p {
      font-size: 35px;
      font-weight: 500;
      line-height: 42px;
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.body3}
      }
    }
    > div {
      ${mixins.flexbox("row", "center", "center")};
      gap: 10px;
      ${media.mobile} {
        gap: 6px;
      }
    }
    .box-percent {
      padding: 10px 12px;
      ${fonts.p1}
      color: ${({ theme }) => theme.color.text20};
      background-color: ${({ theme }) => theme.color.point};
      border-radius: 8px;
      cursor: pointer;
      &:nth-of-type(1),
      &:nth-of-type(3) {
        ${media.mobile} {
          padding: 6px 14px;
          display: none;
        }
      }
    }
  }
  .range {
    width: 100%;
    margin-top: 24px;
    display: flex;
  }

  .loading-wrapper {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;

    &.position {
      height: 165px;
    }

    &.amount {
      height: 236px;
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 250px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
