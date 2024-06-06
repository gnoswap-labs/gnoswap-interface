import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import PositionHistoryTable from "../position-history-table/PositionHistoryTable";
import { PositionHistoryListWrapper } from "./PositionHistoryList.styles";
import { TokenModel } from "@models/token/token-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
interface IPositionHistoryList {
  list: IPositionHistoryModel[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  tokenA: TokenModel;
  tokenB: TokenModel;
  isLoading: boolean;
}

const PositionHistoryList: React.FC<IPositionHistoryList> = ({
  list,
  isFetched,
  breakpoint,
  tokenA,
  tokenB,
  isLoading,
}) => {
  return (
    <PositionHistoryListWrapper>
      <PositionHistoryTable
        list={list}
        isFetched={isFetched}
        breakpoint={breakpoint}
        tokenA={tokenA}
        tokenB={tokenB}
        isLoading={isLoading}
      />
    </PositionHistoryListWrapper>
  );
};

export default PositionHistoryList;
