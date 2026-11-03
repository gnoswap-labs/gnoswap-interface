import React from "react";

import Pagination from "@components/common/pagination/Pagination";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { DEVICE_TYPE } from "@styles/media";

import PositionHistoryTable from "./position-history-table/PositionHistoryTable";

import { PositionHistoryListWrapper, PositionHistoryPaginationWrapper } from "./PositionHistoryList.styles";

interface IPositionHistoryList {
  list: IPositionHistoryModel[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  isLoading: boolean;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  isFetching: boolean;
}

const PositionHistoryList: React.FC<IPositionHistoryList> = ({
  list,
  isFetched,
  breakpoint,
  isLoading,
  currentPage,
  totalPage,
  movePage,
  isFetching,
}) => {
  return (
    <PositionHistoryListWrapper>
      <PositionHistoryTable list={list} isFetched={isFetched} breakpoint={breakpoint} isLoading={isLoading} />
      {totalPage > 1 && (
        <PositionHistoryPaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onPageChange={movePage}
            disabled={isFetching}
            siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
          />
        </PositionHistoryPaginationWrapper>
      )}
    </PositionHistoryListWrapper>
  );
};

export default PositionHistoryList;
