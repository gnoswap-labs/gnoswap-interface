import React from "react";

import { LaunchpadPoolModel, LaunchpadProjectModel } from "@models/launchpad";
import { ProjectInfoWrapper, TableColumn } from "./LaunchpadProjectInfo.styles";
import LaunchpadProjectInfoChip from "./launchpad-project-info-chip/LaunchpadProjectInfoChip";
import IconStar from "@components/common/icons/IconStar";
import { formatRate } from "@utils/new-number-utils";

interface LaunchpadProjectInfoProps {
  project: LaunchpadProjectModel;
}

const LaunchpadProjectInfo: React.FC<LaunchpadProjectInfoProps> = ({
  project,
}) => {
  const { status, name, pools } = project;

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

  return (
    <ProjectInfoWrapper>
      <TableColumn className="left" tdWidth={210}>
        <span>{name}</span>
      </TableColumn>
      <TableColumn tdWidth={210}>
        <span>
          <LaunchpadProjectInfoChip type={status} />
        </span>
      </TableColumn>
      <TableColumn tdWidth={210}>
        <span className="apr">{aprStr}</span>
      </TableColumn>
      <TableColumn tdWidth={210}>
        <span>{highestAprPool?.participant.toLocaleString() || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={210}>
        <span>{highestAprPool?.allocation.toLocaleString() || 0}</span>
      </TableColumn>
      <TableColumn tdWidth={210}>
        <span>{highestAprPool?.depositAmount.toLocaleString() || 0}</span>
      </TableColumn>
    </ProjectInfoWrapper>
  );
};

export default LaunchpadProjectInfo;
