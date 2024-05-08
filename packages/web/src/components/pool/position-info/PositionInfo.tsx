// TODO : remove eslint-disable after work
/* eslint-disable */
import IconOpenLink from "@components/common/icons/IconOpenLink";

import {
  MOBILE_POSITION_HISTORY_TD_WIDTH,
  POSITION_HISTORY_TD_WIDTH,
  TABLET_POSITION_HISTORY_TD_WIDTH,
} from "@constants/skeleton.constant";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import {
  HoverSection,
  IconButton,
  PositionInfoWrapper,
  TableColumn,
  TableColumnTooltipContent,
} from "./PositionInfo.styles";
import { DEVICE_TYPE } from "@styles/media";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { prettyNumber, prettyNumberFloatInteger } from "@utils/number-utils";
import Tooltip from "@components/common/tooltip/Tooltip";
import { getDateUtcToLocal } from "@common/utils/date-util";

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
  const { time, type, usdValue, amountA, amountB, txHash } = item;
  const td =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_TD_WIDTH
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
        ? TABLET_POSITION_HISTORY_TD_WIDTH
        : POSITION_HISTORY_TD_WIDTH;
  const timeFormat = getDateUtcToLocal(time);

  return (
    <PositionInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={td[0]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                {`${timeFormat.value} (UTC+${timeFormat.offsetHours})`}
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index">{dayjs(time).fromNow()}</span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="left" tdWidth={td[1]}>
          <span className="position-index">
            {type}
            <IconButton
              onClick={() => {
                window.open(`https://gnoscan.io/transactions/details?txhash=${txHash}`, "_blank");
              }}
            >
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[2]}>
          <span className="position-index">{Number(item.usdValue) < 0.01 && Number(item.usdValue) ? "<$0.01" : `$${prettyNumber(item.usdValue)}`}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[3]}>
          <span className="position-index">{`${prettyNumberFloatInteger(`${Number(item.amountA)}`, true)} ${tokenASymbol}`}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[4]}>
          <span className="position-index">{`${prettyNumberFloatInteger(`${Number(item.amountB)}`, true)} ${tokenBSymbol}`}</span>
        </TableColumn>
      </HoverSection>
    </PositionInfoWrapper>
  );
};
export default PositionInfo;
