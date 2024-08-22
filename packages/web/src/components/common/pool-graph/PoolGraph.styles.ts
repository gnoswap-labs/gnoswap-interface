import styled from "@emotion/styled";

export const PoolGraphWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  overflow: visible;

  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  svg {
    .bin-wrapper {
      .bin-inner {
        stroke: ${({ theme }) => theme.color.background06};
      }
      &:hover {
        .bin-inner {
          opacity: 0.4;
        }
      }
    }
  }
`;
