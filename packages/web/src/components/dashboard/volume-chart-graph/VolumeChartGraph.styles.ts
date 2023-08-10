import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const VolumeChartGraphWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  border-radius: 8px;
  justify-content: space-between;
  padding: 24px 24px 23px 24px;
  ${media.mobile} {
    flex-direction: column;
    padding: 24px 0px 0px 13px;
  }

  .data-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 755px;
    width: 100%;

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
        ${media.mobile} {
          ${fonts.p6};
        }
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }
`;
