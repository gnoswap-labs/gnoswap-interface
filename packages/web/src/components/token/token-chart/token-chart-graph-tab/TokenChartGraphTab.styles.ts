import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TokenChartGraphTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: auto;
  margin-bottom: 12px;
  
  .chart-select-button {
    width: 60px;
    height: 37px;
  }
  .select-tab-wrapper {
    border: none;
  }
  @media (max-width: 1180px) {
    .chart-select-button {
      ${fonts.body12}
    }
    .chart-select-button {
      width: 60px;
      height: 34px;
    }
  }
  ${media.mobile} {
    margin-bottom: 0;
    width: 100%;
    > div {
      border: none;
      background: ${({ theme }) => theme.color.background11};
    }
    .chart-select-button {
      width: auto;
      ${fonts.p2}
    }
    .selected {
      background-color: ${({ theme }) => theme.color.background02} !important;
    }
    .chart-select-button {
      height: 28px;
      flex: 1;
    }
  }
`;
