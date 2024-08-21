import { cx } from "@emotion/css";
import React from "react";

import { AssetReceiveButton } from "@components/wallet/asset-button/AssetReceiveButton";
import { AssetSendButton } from "@components/wallet/asset-button/AssetSendButton";
import {
  emptyArrayInit,
  pulseSkeletonStyle,
  TableInfoType,
  TABLE_TITLE
} from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";

import {
  SkeletonItem,
  SkeletonWrapper,
  UnLoadingItem
} from "./TableSkeleton.styles";


interface TableSkeletonProps {
  info: TableInfoType;
  breakpoint?: DEVICE_TYPE;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ info, className }) => {
  const ASSET_TD = info.list.map(item => item.skeletonWidth);

  return (
    <>
      {emptyArrayInit(info.total).map((_, index) => (
        <SkeletonWrapper key={index} title={info.title} className={className}>
          {info.list.filter(item => !item.hideSkeleton).map((item, idx) => (
            <SkeletonItem
              key={idx}
              className={cx({
                left: item.left,
                [item.className as string]: true,
              })}
              tdWidth={info.list[idx].width}
            >
              <span
                css={pulseSkeletonStyle({ w: item.skeletonWidth, type: item.type })}
              />
            </SkeletonItem>
          ))}
          {info.title === TABLE_TITLE.ASSET_TABLE && (
            <>
              <UnLoadingItem
                className="right-padding-16"
                tdWidth={ASSET_TD[ASSET_TD.length - 2]}
              >
                <AssetReceiveButton onClick={() => false} disabled />
              </UnLoadingItem>
              <UnLoadingItem
                className="right-padding-16"
                tdWidth={ASSET_TD[ASSET_TD.length - 1]}
              >
                <AssetSendButton onClick={() => false} disabled />
              </UnLoadingItem>
            </>
          )}
        </SkeletonWrapper>
      ))}
    </>
  );
};

export default TableSkeleton;
