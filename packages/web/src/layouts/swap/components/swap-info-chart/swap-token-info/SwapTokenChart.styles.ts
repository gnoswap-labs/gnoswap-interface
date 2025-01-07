import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const SwapTokenChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
`;

export const ChartNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
  font-size: 14px;
`;

export const LoadingWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "center")}
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  border-radius: 8px;
  > span {
    margin-top: 6px;
    color: ${({ theme }) => theme.color.text04} ${fonts.body11};
  }
  > div {
    width: 36px;
    height: 36px;
    &::before {
      background-color: ${({ theme }) => theme.color.background01};
      width: 26px;
      height: 26px;
    }
  }
`;
