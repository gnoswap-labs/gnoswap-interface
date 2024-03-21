// TODO : remove eslint-disable after work
/* eslint-disable */
import { IHistory } from "@containers/position-history-container/PositionHistoryContainer";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import PositionHistoryTable from "../position-history-table/PositionHistoryTable";
import { PositionHistoryListWrapper } from "./PositionHistoryList.styles";
import { TokenModel } from "@models/token/token-model";
interface IPositionHistoryList {
  list: IHistory[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  tokenA: TokenModel;
  tokenB: TokenModel;
}

const PositionHistoryList: React.FC<IPositionHistoryList> = ({
  list,
  isFetched,
  breakpoint,
  tokenA,
  tokenB,
}) => {
  return (
    <PositionHistoryListWrapper>
      <PositionHistoryTable
        list={list}
        isFetched={isFetched}
        breakpoint={breakpoint}
        tokenA={tokenA}
        tokenB={tokenB}
      />
    </PositionHistoryListWrapper>
  );
};

export default PositionHistoryList;
