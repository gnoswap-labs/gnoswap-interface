// TODO : remove eslint-disable after work
/* eslint-disable */
import { IHistory } from "@containers/position-history-container/PositionHistoryContainer";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import PositionHistoryTable from "../position-history-table/PositionHistoryTable";
import { PositionHistoryListWrapper } from "./PositionHistoryList.styles";
interface IPositionHistoryList {
  list: IHistory[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
}

const PositionHistoryList: React.FC<IPositionHistoryList> = ({
  list,
  isFetched,
  breakpoint,
}) => {
  return (
    <PositionHistoryListWrapper>
      <PositionHistoryTable
        list={list}
        isFetched={isFetched}
        breakpoint={breakpoint}
      />
    </PositionHistoryListWrapper>
  );
};

export default PositionHistoryList;
