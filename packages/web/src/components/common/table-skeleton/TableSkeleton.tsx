import React from "react";
import {
  ASSET_TD_WIDTH,
  emptyArrayInit,
  type SHAPE_TYPES,
  pulseSkeletonStyle,
  TABLE_TITLE,
  MOBILE_ASSET_TD_WIDTH,
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
import { DEVICE_TYPE } from "@styles/media";

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
  breakpoint?: DEVICE_TYPE;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ info, breakpoint, className }) => {

  const ASSET_TD = breakpoint === DEVICE_TYPE.MOBILE ? MOBILE_ASSET_TD_WIDTH: ASSET_TD_WIDTH;

  return (
    <>
      {emptyArrayInit(info.total).map((_, index) => (
        <SkeletonWrapper key={index} title={info.title} className={className}>
          {info.list.map((item, idx) => (
            <SkeletonItem
              key={idx}
              className={cx({
                left: item.left,
                [item.className as string]: true,
              })}
              tdWidth={info.tdWidth[idx]}
            >
              <span
                css={pulseSkeletonStyle({ w: item.width, type: item.type })}
              />
            </SkeletonItem>
          ))}
          {info.title === TABLE_TITLE.ASSET_TABLE && (
            <>
              <UnLoadingItem
                className="right-padding-16"
                tdWidth={ASSET_TD[ASSET_TD.length - 2]}
              >
                <DepositButton onClick={() => false} disabled />
              </UnLoadingItem>
              <UnLoadingItem
                className="right-padding-16"
                tdWidth={ASSET_TD[ASSET_TD.length - 1]}
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
