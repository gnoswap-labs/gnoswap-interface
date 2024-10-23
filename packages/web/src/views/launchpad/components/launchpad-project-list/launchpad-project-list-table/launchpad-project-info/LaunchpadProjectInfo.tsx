import React from "react";

import { formatRate } from "@utils/new-number-utils";
import { DEVICE_TYPE } from "@styles/media";
import {
  PROJECT_INFO,
  PROJECT_INFO_SMALL_TABLET,
  PROJECT_INFO_TABLET,
  PROJECT_INFO_MOBILE,
} from "@constants/skeleton.constant";
import { toNumberFormat } from "@utils/number-utils";

import { LaunchpadPoolModel, LaunchpadProjectModel } from "@models/launchpad";
import { ProjectInfoWrapper, TableColumn } from "./LaunchpadProjectInfo.styles";
import LaunchpadProjectInfoChip from "./launchpad-project-info-chip/LaunchpadProjectInfoChip";
import IconStar from "@components/common/icons/IconStar";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface LaunchpadProjectInfoProps {
  breakpoint: DEVICE_TYPE;
  project: LaunchpadProjectModel;

  moveProjectDetail: (poolId: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
}

const LaunchpadProjectInfo: React.FC<LaunchpadProjectInfoProps> = ({
  breakpoint,
  project,
  moveProjectDetail,
  moveRewardTokenSwapPage,
}) => {
  const {
    status,
    name,
    pools,
    projectId,
    rewardTokenLogoUrl,
    rewardTokenSymbol,
    rewardTokenPath,
  } = project;

  const highestApr = React.useMemo(() => {
    return pools.reduce((acc, current) => {
      if (Number(current.apr) > acc) {
        return Number(current.apr);
      }
      return acc;
    }, Number(pools?.[0].apr ?? 0));
  }, [pools]);

  const aprStr = React.useMemo(() => {
    if (!highestApr) return "-";

    return (
      <>
        {Number(highestApr) > 100 && <IconStar size={14} />}
        {formatRate(highestApr)}
      </>
    );
  }, [highestApr]);

  const calculateTotals = (pools: LaunchpadPoolModel[]) => {
    return pools.reduce(
      (totals, pool) => {
        return {
          totalParticipants: totals.totalParticipants + pool.participant,
          totalAllocation: totals.totalAllocation + pool.allocation,
          totalDeposit: totals.totalDeposit + pool.depositAmount,
        };
      },
      {
        totalParticipants: 0,
        totalAllocation: 0,
        totalDeposit: 0,
      },
    );
  };

  const totals = React.useMemo(() => calculateTotals(pools), [pools]);

  const cellWidths =
    breakpoint === DEVICE_TYPE.MOBILE
      ? PROJECT_INFO_MOBILE
      : breakpoint === DEVICE_TYPE.TABLET_M
      ? PROJECT_INFO_SMALL_TABLET
      : breakpoint === DEVICE_TYPE.TABLET
      ? PROJECT_INFO_TABLET
      : PROJECT_INFO;

  return (
    <ProjectInfoWrapper>
      <TableColumn
        className="left clickable"
        tdWidth={cellWidths.list[0].width}
        onClick={() => moveProjectDetail(projectId)}
      >
        <MissingLogo
          symbol={rewardTokenSymbol}
          url={rewardTokenLogoUrl || undefined}
          width={24}
          mobileWidth={24}
        />
        <span>{name}</span>
        <span className="reward-token-symbol">{rewardTokenSymbol}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[1].width}>
        <span>
          <LaunchpadProjectInfoChip type={status} />
        </span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[2].width}>
        <span className="apr">{aprStr}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[3].width}>
        <span>{toNumberFormat(totals.totalParticipants, 2) || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[4].width}>
        <span>
          {toNumberFormat(totals.totalAllocation, 2) || 0} {rewardTokenSymbol}
        </span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[5].width}>
        <span>{toNumberFormat(totals.totalDeposit, 2) || 0} GNS</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[6].width}>
        <div
          className="button-wrapper"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            moveRewardTokenSwapPage(rewardTokenPath);
          }}
        >
          <span>Swap</span>
          <span className="svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.72668 11.06L8.78002 8L5.72668 4.94L6.66668 4L10.6667 8L6.66668 12L5.72668 11.06Z"
                fill="#596782"
              />
            </svg>
          </span>
        </div>
      </TableColumn>
    </ProjectInfoWrapper>
  );
};

export default LaunchpadProjectInfo;
