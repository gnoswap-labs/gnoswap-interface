// TODO : remove eslint-disable after work
/* eslint-disable */
import IconOpenLink from "@components/common/icons/IconOpenLink";

import {
  MOBILE_POSITION_HISTORY_TD_WIDTH,
  POSITION_HISTORY_TD_WIDTH,
  TABLET_POSITION_HISTORY_TD_WIDTH,
} from "@constants/skeleton.constant";
import { IHistory } from "@containers/position-history-container/PositionHistoryContainer";
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
dayjs.extend(relativeTime);

interface PositionInfoProps {
  item: IHistory;
  key?: number;
  breakpoint: DEVICE_TYPE;
}

const PositionInfo: React.FC<PositionInfoProps> = ({
  item,
  key,
  breakpoint,
}) => {
  const { timeStamp, action, value, gnsAmount, gnotAmount } = item;
  const td =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_TD_WIDTH
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
      ? TABLET_POSITION_HISTORY_TD_WIDTH
      : POSITION_HISTORY_TD_WIDTH;

  return (
    <PositionInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={td[0]}>
          <span className="position-index">{timeStamp}</span>
        </TableColumn>
        <TableColumn className="left" tdWidth={td[1]}>
          <span className="position-index">
            {action}
            <IconButton
              onClick={() => {
                window.open("/", "_blank");
              }}
            >
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[2]}>
          <span className="position-index">{value}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[3]}>
          <span className="position-index">{gnsAmount}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={td[4]}>
          <span className="position-index">{gnotAmount}</span>
        </TableColumn>
      </HoverSection>
    </PositionInfoWrapper>
  );
};
export default PositionInfo;
