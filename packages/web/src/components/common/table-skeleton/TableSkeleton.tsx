import React from "react";
import {
  ASSET_TD_WIDTH,
  emptyArrayInit,
  type SHAPE_TYPES,
  skeletonStyle,
  TABLE_TITLE,
} from "@constants/skeleton.constant";
import { cx } from "@emotion/css";
import {
  SkeletonItem,
  SkeletonWrapper,
  UnLoadingItem,
} from "./TableSkeleton.styles";
import {
  DepositButton,
  WithdrawButton,
} from "@components/wallet/asset-info/AssetInfo";

export interface TableInfoType {
  title: TABLE_TITLE;
  total: number;
  tdWidth: number[];
  list: List[];
}
interface List {
  width: number;
  type: SHAPE_TYPES;
  left: boolean;
  className?: string;
}
interface TableSkeletonProps {
  info: TableInfoType;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ info }) => {
  return (
    <>
      {emptyArrayInit(info.total).map((_, index) => (
        <SkeletonWrapper key={index} title={info.title}>
          {info.list.map((item, idx) => (
            <SkeletonItem
              key={idx}
              className={cx({ left: item.left, [item.className as string]: true })}
              tdWidth={info.tdWidth[idx]}
            >
              <span css={skeletonStyle(item.width, item.type)} />
            </SkeletonItem>
          ))}
          {info.title === TABLE_TITLE.ASSET_TABLE && (
            <>
              <UnLoadingItem
                tdWidth={ASSET_TD_WIDTH[ASSET_TD_WIDTH.length - 2]}
              >
                <DepositButton onClick={() => false} disabled />
              </UnLoadingItem>
              <UnLoadingItem
                tdWidth={ASSET_TD_WIDTH[ASSET_TD_WIDTH.length - 1]}
              >
                <WithdrawButton onClick={() => false} disabled />
              </UnLoadingItem>
            </>
          )}
        </SkeletonWrapper>
      ))}
    </>
  );
};

export default TableSkeleton;
