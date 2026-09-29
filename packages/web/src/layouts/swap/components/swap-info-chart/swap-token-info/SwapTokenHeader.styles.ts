import styled from "@emotion/styled";
import { priceWarningStyle } from "@layouts/leaderboard-layout/components/common/common.styles";

export const SwapTokenHeaderWrapper = styled.div`

  gap: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    flex: 1 1 auto;
    min-width: 0;
    .token-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
      font-weight: 500;
      min-width: 0;
      flex: 1 1 auto;
      .name {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        width: 100%;

        color: ${({ theme }) => theme.color.text02};
        font-size: 18px;
        .token-name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 0 0 auto;
          cursor: pointer;
          &:hover {
            color: ${({ theme }) => theme.color.text07};
          }
        }
        .link {
          flex: 0 1 auto;
          min-width: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 4px;
          color: ${({ theme }) => theme.color.text04};
          font-size: 10px;
          font-weight: 400;
          padding: 2px 4px;
          border-radius: 4px;
          background-color: ${({ theme }) => (theme.themeKey === "dark" ? "#0D121C" : "rgba(224, 232, 244, 0.40)")};
          span {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            direction: rtl;
            white-space: nowrap;
          }
          .path-link-icon {
            width: 10px;
            height: 10px;
            flex-shrink: 0;
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
    flex: 0 0 auto;
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
        &.informational-price {
          ${({ theme }) => priceWarningStyle(theme)}
        }
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
