import React from "react";

import { LaunchpadPoolModel, LaunchpadProjectModel } from "@models/launchpad";
import { ProjectInfoWrapper, TableColumn } from "./LaunchpadProjectInfo.styles";
import LaunchpadProjectInfoChip from "./launchpad-project-info-chip/LaunchpadProjectInfoChip";
import IconStar from "@components/common/icons/IconStar";
import { formatRate } from "@utils/new-number-utils";
import { DEVICE_TYPE } from "@styles/media";
import {
  PROJECT_INFO,
  PROJECT_INFO_SMALL_TABLET,
  PROJECT_INFO_TABLET,
  PROJECT_INFO_MOBILE,
} from "@constants/skeleton.constant";

interface LaunchpadProjectInfoProps {
  breakpoint: DEVICE_TYPE;
  project: LaunchpadProjectModel;

  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadProjectInfo: React.FC<LaunchpadProjectInfoProps> = ({
  breakpoint,
  project,
  moveProjectDetail,
}) => {
  const { status, name, pools, projectId } = project;

  const highestAprPool = pools.reduce((max, current) => {
    if (!current.apr) return max;
    if (!max || !max.apr || current.apr > max.apr) return current;
    return max;
  }, undefined as LaunchpadPoolModel | undefined);

  const aprStr = React.useMemo(() => {
    if (!highestAprPool?.apr) return "-";

    return (
      <>
        {Number(highestAprPool?.apr) > 100 && <IconStar size={14} />}
        {formatRate(highestAprPool?.apr)}
      </>
    );
  }, [highestAprPool?.apr]);

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
      <TableColumn className="left" tdWidth={cellWidths.list[0].width}>
        <span>{name}</span>
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
        <span>{highestAprPool?.participant.toLocaleString() || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[4].width}>
        <span>{highestAprPool?.allocation.toLocaleString() || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[5].width}>
        <span>{highestAprPool?.depositAmount.toLocaleString() || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[6].width}>
        <div
          className="button-wrapper"
          onClick={() => moveProjectDetail(projectId)}
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
