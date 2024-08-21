import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const IncreaseAmountInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 2px;

  .pair-amount {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 2px;
    .token {
      > div {
        padding-top: 5px;
        padding-bottom: 5px;∏
        height: auto;
      }
      .token-symbol {
        ${fonts.body9}
        margin-right: 6px;
        height: 100%;
        margin-left: 0;
      }
    }
    .icon-wrapper {
      position: absolute;
      display: flex;
      left: calc(50% - 20px);
      top: calc(50% - 20px);
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      background-color: ${({ theme }) => theme.color.background01};
      border: 1px solid ${({ theme }) => theme.color.border02};

      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon02};
        }
      }
    }
    > div {
      &:nth-of-type(1),
      &:nth-of-type(2) {
        padding: 16px;
      }
    }
  }
`;
