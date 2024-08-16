import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const PriceStepsWrapper = styled.div`
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
      width: 32px;
      height: 32px;
      border-radius: 4px;
      justify-content: center;
      align-items: center;
      color: ${({ theme }) => theme.color.icon05};
      ${fonts.body6}
      line-height: 22px;
      cursor: pointer;
      span {
        height: 24px;
      }
      &.disabled {
        pointer-events: none;
        cursor: default;
        color: ${({ theme }) => theme.color.icon08};
        background: ${({ theme }) => theme.color.backgroundOpacity8};
      }
      &:hover {
        background: ${({ theme }) => theme.color.backgroundOpacity};
      }
      background: ${({ theme }) => theme.color.background05};
      svg * {
        fill: ${({ theme }) => theme.color.icon05};
      }

    }

    .value-wrapper {
      height: 34px;
      ${fonts.body4}
      position: relative;
      input {
        width: 100px;
        text-align: center;
        display: block;
        ${media.mobile} {
          width: calc(100vw - 220px);
          max-width: 300px;
        }
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
    .token-info {
      display: inline-flex;
      word-break: break-all;
    }
    color: ${({ theme }) => theme.color.text04};
    ${fonts.p4}
  }
  ${media.mobile} {
    padding: 12px;
    gap: 4px;
  }
`;
