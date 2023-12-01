import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const TokenChartGraphWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background15};
  border-radius: 8px;
  justify-content: space-between;
  padding: 0 5px 12px 0;

  .data-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 757px;

    .graph {
      border-bottom: 1px solid ${({ theme }) => theme.color.border02};
      border-right: 1px solid ${({ theme }) => theme.color.border02};
    }
    @media (max-width: 930px) {
      max-width: 800px;
    }
    .xaxis-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin: 12px 0 0 0;
      padding-right: 13px;
      padding-left: 12px;
      justify-content: space-between;
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
      
      span {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text04};
        ${media.mobile} {
          ${fonts.p7};
        }
      }
      ${media.mobile} {
        padding-right: 4px;
        padding-left: 4px;
        margin-top: 4px;
      }
    }
  }

  .yaxis-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column-reverse;
    width: 24px;
    padding: 8px 0 9px 5px;
    margin-bottom: 30px;
    justify-content: space-between;
    span {
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};
    }
    .large-text {
      ${fonts.body12};
    }
    .medium-text {
      ${fonts.p4}
    }
    .small-text {
      ${fonts.p6}
    }
    ${media.mobile} {
      ${fonts.p7};
      padding-left: 0px;
      width: 14px;
      span {
        ${fonts.p7};
      }
      .large-text {
        ${fonts.p7};
      }
      .medium-text {
        font-size: 7px;
        line-height: 9px;
      }
      .small-text {
        font-size: 5px;
        line-height: 7px;
      }
    }
  }
  ${media.mobile} {
    padding: 0 5px 4px 0;
  }
`;
