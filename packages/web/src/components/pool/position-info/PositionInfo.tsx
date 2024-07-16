import IconOpenLink from "@components/common/icons/IconOpenLink";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import {
  HoverSection,
  IconButton,
  PositionInfoWrapper,
  TableColumn,
} from "./PositionInfo.styles";
import { DEVICE_TYPE } from "@styles/media";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import {
  MOBILE_POSITION_HISTORY_INFO,
  POSITION_HISTORY_INFO,
  TABLET_POSITION_HISTORY_INFO,
} from "@constants/skeleton.constant";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";

dayjs.extend(relativeTime);

interface PositionInfoProps {
  item: IPositionHistoryModel;
  key?: number;
  breakpoint: DEVICE_TYPE;
  tokenASymbol: string;
  tokenBSymbol: string;
}

const PositionInfo: React.FC<PositionInfoProps> = ({
  item,
  key,
  breakpoint,
  tokenASymbol,
  tokenBSymbol,
}) => {
  const { getTxUrl } = useGnoscanUrl();
  const { time, type, usdValue, amountA, amountB, txHash } = item;
  const tableInfo =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_INFO
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
      ? TABLET_POSITION_HISTORY_INFO
      : POSITION_HISTORY_INFO;

  return (
    <PositionInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={tableInfo.list[0].width}>
          <DateTimeTooltip date={time}>
            <span className="token-index">{dayjs(time).fromNow()}</span>
          </DateTimeTooltip>
        </TableColumn>
        <TableColumn className="left" tdWidth={tableInfo.list[1].width}>
          <span className="position-index">
            {type}
            <IconButton onClick={() => window.open(getTxUrl(txHash), "_blank")}>
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[2].width}>
          <span className="position-index">
            {formatOtherPrice(usdValue, {
              isKMB: false,
            })}
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[3].width}>
          <span className="position-index">{`${formatPoolPairAmount(amountA, {
            decimals: 6,
          })} ${tokenASymbol}`}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[4].width}>
          <span className="position-index">{`${formatPoolPairAmount(amountB, {
            decimals: 6,
          })} ${tokenBSymbol}`}</span>
        </TableColumn>
      </HoverSection>
    </PositionInfoWrapper>
  );
};
export default PositionInfo;
