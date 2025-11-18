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
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import SwapPageButton from "@components/launchpad/swap-page-button/SwapPageButton";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
import { QUERY_PARAMETER } from "@constants/page.constant";

interface LaunchpadProjectInfoProps {
  border?: boolean;
  breakpoint: DEVICE_TYPE;
  project: LaunchpadProjectModel;

  moveProjectDetail: (projectID: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
}

const LaunchpadProjectInfo: React.FC<LaunchpadProjectInfoProps> = ({
  border,
  breakpoint,
  project,
  moveProjectDetail,
  moveRewardTokenSwapPage,
}) => {
  const { status, name, pools, projectID, rewardTokenLogoURL, rewardTokenSymbol, rewardTokenPath } = project;

  const { prefetch } = usePrefetchNavigation({
    pageType: "PROJECT",
    params: {
      [QUERY_PARAMETER.PROJECT_PATH]: projectID,
    },
  });

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
        {Number(highestApr) > 100 && "✨"}
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

  const handleClick = React.useCallback(() => {
    moveProjectDetail(projectID);
  }, [moveProjectDetail, projectID]);

  const handleMouseEnter = React.useCallback(() => {
    prefetch();
  }, [prefetch]);

  return (
    <ProjectInfoWrapper className={border ? "border-top" : ""}>
      <TableColumn
        className="left clickable"
        tdWidth={cellWidths.list[0].width}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <MissingLogo symbol={rewardTokenSymbol} url={rewardTokenLogoURL || undefined} width={24} mobileWidth={24} />
        <span className="ellipsis">{name}</span>
        <span className="reward-token-symbol">{rewardTokenSymbol}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[1].width}>
        <span>
          <LaunchpadProjectInfoChip type={status} />
        </span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[2].width}>
        <span className="ellipsis">{aprStr}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[3].width}>
        <span className="ellipsis">{toNumberFormat(totals.totalParticipants, 2) || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[4].width}>
        <span className="ellipsis">
          {toNumberFormat(totals.totalAllocation, 2) || 0} {rewardTokenSymbol}
        </span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[5].width}>
        <span className="ellipsis">{toNumberFormat(totals.totalDeposit, 2) || 0} GNS</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[6].width}>
        <SwapPageButton
          className="button-wrapper"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            moveRewardTokenSwapPage(rewardTokenPath);
          }}
        />
      </TableColumn>
    </ProjectInfoWrapper>
  );
};

export default LaunchpadProjectInfo;
