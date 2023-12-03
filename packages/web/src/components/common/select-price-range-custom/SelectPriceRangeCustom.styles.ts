import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const SelectPriceRangeCustomWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 16px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: ${({ theme }) => theme.color.background11};
  border-radius: 8px;

  .starting-price-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    .sub-title {
      color: ${({ theme }) => theme.color.text05};
      ${fonts.p4}
      line-height: 22px;
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
      background: ${({ theme }) => theme.color.backgroundOpacity};
      ${fonts.body10}
    }
  }

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
          width: 72px;
        }
      }
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
        background: ${({ theme }) => theme.color.background02};
        color: ${({ theme }) => theme.color.icon05};
        ${fonts.body6}
        line-height: 22px;
        cursor: pointer;
        &:hover {
          background: ${({ theme }) => theme.color.backgroundOpacity};
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
    height: 220px;
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
      color: ${({ theme }) => theme.color.text04};
    }
    ${fonts.body12};
  }

  .range-controller-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
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
  }
`;
