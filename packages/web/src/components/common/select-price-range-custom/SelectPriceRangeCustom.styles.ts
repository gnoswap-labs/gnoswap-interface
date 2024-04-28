import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectPriceRangeCustomWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 16px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: ${({ theme }) => theme.color.background11};
  border-radius: 8px;

  .option-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    > div {
      padding: 2px;
      ${media.mobile} {
        button {
          width: 65px;
          height: 24px;
        }
      }
    }
    .button-option-contaier {
      ${mixins.flexbox("row", "center", "center")}
      gap: 4px;
    }
    .graph-option-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 4px;

      .graph-option-item {
        display: flex;
        padding: 2px;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        justify-content: center;
        align-items: center;
        background: ${({ theme }) => theme.color.background05};
        svg * {
          fill: ${({ theme }) => theme.color.icon05};
        }
        ${fonts.body6}
        line-height: 22px;
        cursor: pointer;
        &:hover {
          background: ${({ theme }) => theme.color.backgroundOpacity};
        }
        position: relative;
        ${media.mobile} {
          width: 24px;
          height: 24px;
          svg {
            width: 16px;
            height: 16px;
          }
        }
      }
      .disabled-option {
        pointer-events: none;
        &::before {
          position: absolute;
          content: "";
          width: 100%;
          border-radius: 4px;
          height: 100%;
          top: 0;
          background: ${({ theme }) => theme.color.backgroundOpacity8};
          left: 0;
        }
      }
    }
  }

  .loading-wrapper {
    margin: 73px 0;
    > div {
      width: 60px;
      height: 60px;
      &:before {
        width: 48px;
        height: 48px;
      }
    }
  }

  .loading-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .current-price-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.color.text10};
    > span:first-of-type {
      display: flex;
      color: ${({ theme }) => theme.color.text04};
    }
    > span:last-of-type {
      display: flex;
    }
    ${fonts.body12};
  }
  .pool-initialization {
    background-color: ${({ theme }) => theme.color.backgroundOpacity4};
    color: ${({ theme }) => theme.color.text08};
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    padding: 12px 16px;
    gap: 16px;
    border-radius: 8px;
    > div {
      ${fonts.body12}
    }
    span {
      ${fonts.body12}
      font-weight: 600;
    }
  }
  .rangge-content-wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: relative;
    .dim-content-3 {
      position: absolute;
      bottom: -24px;
      height: calc(100% + 24px);
      width: calc(100% + 32px);
      left: -16px;
      border-radius: 0 0 8px 8px;
      background: ${({ theme }) => theme.color.backgroundOpacity8};
    }
  }
  .range-graph-wrapper {
    width: 100%;
    overflow: hidden;
    > div {
      align-items: center;
    }
  }
  .range-controller-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    ${media.mobile} {
      flex-direction: column;
    }
  }

  .extra-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .icon-button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 4px;
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.text10};
        }
      }
      span {
        color: ${({ theme }) => theme.color.text10};
        ${fonts.body11};
        &:nth-of-type(2) {
          display: none;
        }
      }
    }
    .icon-button:hover {
      svg * {
        fill: ${({ theme }) => theme.color.text16};
      }
      span {
        color: ${({ theme }) => theme.color.text16};
      }
    }
    ${media.mobile} {
      flex-direction: row;
      gap: 16px;
      align-items: flex-start;
      .icon-button {
        span {
          &:nth-of-type(1) {
            display: none;
          }
          &:nth-of-type(2) {
            display: initial;
          }
        }
      }
    }
  }
  ${media.mobile} {
    padding: 16px 12px;
  }
`;

export const StartingPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  align-self: stretch;

  .title-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    line-height: 22px;

    .sub-title {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
    }
    .price-info {
      ${mixins.flexbox("row", "center", "center")}
      gap: 2px;
      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
    }
    .description {
      ${mixins.flexbox("row", "center", "center")}
      height: 16px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
    }
  }

  .starting-price-input {
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    text-align: right;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    ${fonts.body12}

    &::placeholder {
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const TooltipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;