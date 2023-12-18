import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const SelectPriceRangeCutomControllerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  padding: 16px 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  justify-content: center;
  align-items: center;
  gap: 8px;

  .title {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12};
  }

  .controller-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .icon-wrapper {
      display: flex;
      flex-shrink: 0;
      padding: 2px;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      justify-content: center;
      align-items: flex-start;
      color: ${({ theme }) => theme.color.icon05};
      ${fonts.body6}
      line-height: 22px;
      cursor: pointer;

      &.disabled {
        cursor: default;
        color: ${({ theme }) => theme.color.icon08};
      }
    }

    .value-wrapper {
      height: 34px;
      ${fonts.body4}
      position: relative;
      input {
        width: 110px;
        text-align: center;
        display: block;
      }
    }
    .fake-input {
      position: absolute;
      z-index: -1;
      opacity: 0;
      top: 0;
      pointer-events: none;
      ${fonts.body4}
    }
  }

  .token-info-wrapper {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.p4}
  }
`;
