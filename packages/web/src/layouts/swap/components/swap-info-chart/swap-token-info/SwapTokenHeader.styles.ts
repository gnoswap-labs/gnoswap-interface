import styled from "@emotion/styled";

export const SwapTokenHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
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
          color: #596782;
          font-size: 10px;
          font-weight: 400;
          padding: 2px 4px;
        }
      }
      .symbol {
        color: #596782;
        font-size: 14px;
      }
    }
  }
  .right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    .token-price {
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
      .date {
        color: #596782;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
`;
