import React from "react";

import { IPositionHistoryModel } from "@models/position/position-history-model";
import { DEVICE_TYPE } from "@styles/media";

import PositionHistoryTable from "./position-history-table/PositionHistoryTable";

import { PositionHistoryListWrapper } from "./PositionHistoryList.styles";

interface IPositionHistoryList {
  list: IPositionHistoryModel[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  isLoading: boolean;
}

const PositionHistoryList: React.FC<IPositionHistoryList> = ({
  list,
  isFetched,
  breakpoint,
  isLoading,
}) => {
  return (
    <PositionHistoryListWrapper>
      <PositionHistoryTable
        list={list}
        isFetched={isFetched}
        breakpoint={breakpoint}
        isLoading={isLoading}
      />
    </PositionHistoryListWrapper>
  );
};

export default PositionHistoryList;
