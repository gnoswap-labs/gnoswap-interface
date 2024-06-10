import IconOpenLink from "@components/common/icons/IconOpenLink";

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
import { prettyNumber } from "@utils/number-utils";
import Tooltip from "@components/common/tooltip/Tooltip";
import { getDateUtcToLocal } from "@common/utils/date-util";
import { convertToKMB } from "@utils/stake-position-utils";
import { MOBILE_POSITION_HISTORY_INFO, POSITION_HISTORY_INFO, TABLET_POSITION_HISTORY_INFO } from "@constants/skeleton.constant";

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
  const tableInfo =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_INFO
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
        ? TABLET_POSITION_HISTORY_INFO
        : POSITION_HISTORY_INFO;
  const timeFormat = getDateUtcToLocal(time);

  return (
    <PositionInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={tableInfo.list[0].width}>
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
        <TableColumn className="left" tdWidth={tableInfo.list[1].width}>
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
        <TableColumn className="right" tdWidth={tableInfo.list[2].width}>
          <span className="position-index">{Number(item.usdValue) < 0.01 && Number(usdValue) ? "<$0.01" : `$${prettyNumber(item.usdValue)}`}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[3].width}>
          <span className="position-index">{`${convertToKMB(amountA.toString())} ${tokenASymbol}`}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={tableInfo.list[4].width}>
          <span className="position-index">{`${convertToKMB(amountB.toString())} ${tokenBSymbol}`}</span>
        </TableColumn>
      </HoverSection>
    </PositionInfoWrapper>
  );
};
export default PositionInfo;
