import styled from "@emotion/styled";

interface Props {
  containerWidth: number;
  priceWidth: number;
  tokenNameWidth: number;
}

export const SwapTokenHeaderWrapper = styled.div<Props>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    max-width: ${({ containerWidth, priceWidth }) => `calc(${containerWidth}px - ${priceWidth}px)`};
    width: 100%;
    .token-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
      font-weight: 500;
      .name {
        display: flex;
        align-items: center;
        gap: 8px;

        color: ${({ theme }) => theme.color.text02};
        font-size: 18px;
        .link {
          max-width: ${({ containerWidth, tokenNameWidth, priceWidth }) =>
            `calc(${containerWidth}px - 78px - ${tokenNameWidth}px - ${priceWidth}px)`};
          width: 100%;
          display: flex;
          align-items: center;
          gap: 6px;
          color: ${({ theme }) => theme.color.text04};
          font-size: 10px;
          font-weight: 400;
          padding: 2px 4px;
          border-radius: 4px;
          background-color: ${({ theme }) => (theme.themeKey === "dark" ? "#0D121C" : "rgba(224, 232, 244, 0.40)")};
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            direction: rtl;
            white-space: nowrap;
          }
          &:hover {
            color: ${({ theme }) => theme.color.text03};
            .path-link-icon {
              path {
                fill: ${({ theme }) => theme.color.text03};
              }
            }
          }
        }
      }
      .symbol {
        color: #596782;
        font-size: 14px;
      }
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    .token-price {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      gap: 2px;
      .price {
        color: ${({ theme }) => theme.color.text02};
        font-size: 18px;
        font-weight: 500;
      }
      .blank {
        min-height: 17px;
        font-size: 14px;
      }
      .date {
        position: absolute;
        min-width: 100px;
        text-align: end;
        top: 22px;
        color: #596782;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
`;
