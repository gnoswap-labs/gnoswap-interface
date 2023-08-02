import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const TvlChartGraphWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  border-radius: 8px;
  justify-content: space-between;
  padding: 24px 24px 23px 24px;

  .data-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 755px;

    .graph {
      border: 1px solid ${({ theme }) => theme.color.border02};
    }

    .xaxis-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 17px;
      margin-top: 16px;
      justify-content: space-between;
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};

      span {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }

  .yaxis-wrapper {
    display: flex;
    flex-direction: column-reverse;
    width: 24px;
    margin-left: 15px;
    margin-top: -10px;
    margin-bottom: 30px;
    justify-content: space-between;

    span {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;
