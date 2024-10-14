import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  MOBILE_POSITION_HISTORY_INFO,
  POSITION_HISTORY_INFO,
  TABLET_POSITION_HISTORY_INFO,
} from "@constants/skeleton.constant";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { DexEvent } from "@repositories/common";
import { DEVICE_TYPE } from "@styles/media";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";

import {
  HoverSection,
  IconButton,
  PositionInfoWrapper,
  TableColumn,
} from "./PositionInfo.styles";

dayjs.extend(relativeTime);

interface PositionInfoProps {
  item: IPositionHistoryModel;
  key?: number;
  breakpoint: DEVICE_TYPE;
}

const PositionInfo: React.FC<PositionInfoProps> = ({ item, breakpoint }) => {
  const { getTxUrl } = useGnoscanUrl();
  const { t } = useTranslation();
  const {
    time,
    type,
    usdValue,
    amountA,
    amountB,
    txHash,
    tokenASymbol,
    tokenBSymbol,
  } = item;
  const tableInfo =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_INFO
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
      ? TABLET_POSITION_HISTORY_INFO
      : POSITION_HISTORY_INFO;

  const typeKey = useMemo(() => {
    switch (type) {
      case DexEvent.ADD:
        return "business:onchainActi.action.create";
      case DexEvent.DECREASE:
        return "business:onchainActi.action.decrease";
      case DexEvent.INCREASE:
        return "business:onchainActi.action.increase";
      case DexEvent.REMOVE:
        return "business:onchainActi.action.remove";
      case DexEvent.REPOSITION:
        return "business:onchainActi.action.reposition";
      case DexEvent.CLAIM_FEE:
        return "business:onchainActi.action.claimFees";
      case DexEvent.UNSTAKE:
        return "business:onchainActi.action.unstake";
      case DexEvent.STAKE:
        return "business:onchainActi.action.stake";
      case DexEvent.CLAIM_REWARD:
        return "business:onchainActi.action.claimRewards";
      default:
        return "undefined";
    }
  }, [type]);

  return (
    <PositionInfoWrapper key={item.txHash}>
      <HoverSection>
        <TableColumn className="left" tdWidth={tableInfo.list[0].width}>
          <DateTimeTooltip date={time}>
            <span className="token-index">{dayjs(time).fromNow()}</span>
          </DateTimeTooltip>
        </TableColumn>
        <TableColumn className="left" tdWidth={tableInfo.list[1].width}>
          <span className="position-index">
            {t(typeKey)}
            <IconButton onClick={() => window.open(getTxUrl(txHash), "_blank")}>
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[2].width}>
          <span className="position-index">
            {usdValue
              ? formatOtherPrice(usdValue, {
                  isKMB: false,
                })
              : "-"}
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[3].width}>
          <span className="position-index">
            {amountA
              ? `${formatPoolPairAmount(amountA, {
                  decimals: 6,
                })} ${tokenASymbol}`
              : "-"}
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[4].width}>
          <span className="position-index">
            {amountB
              ? `${formatPoolPairAmount(amountB, {
                  decimals: 6,
                })} ${tokenBSymbol}`
              : "-"}
          </span>
        </TableColumn>
      </HoverSection>
    </PositionInfoWrapper>
  );
};
export default PositionInfo;
