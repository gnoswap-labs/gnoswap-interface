/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import { ContentsHeaderWrapper } from "./LaunchpadDetailContentsHeader.styles";
import LaunchpadStatusTimeChip from "../common/launchpad-status-time-chip/LaunchpadStatusTimeChip";

interface LaunchpadDetailContentsHeaderProps {
  data: {
    name: string;
    projectStatus: string | null;
    startTime?: string;
    endTime?: string;
  };
  rewardInfo: ProjectRewardInfoModel;
}

const LaunchpadDetailContentsHeader: React.FC<
  LaunchpadDetailContentsHeaderProps
> = ({ data, rewardInfo }) => {
  return (
    <ContentsHeaderWrapper className="contents-header">
      <div className="symbol-icon">
        <img
          src={rewardInfo.rewardTokenLogoUrl}
          alt={`${rewardInfo.rewardTokenSymbol} symbol image`}
        />
      </div>
      <div className="project-name">{data.name}</div>
      {data.projectStatus && (
        <LaunchpadStatusTimeChip
          startTime={data.startTime}
          endTime={data.endTime}
          status={data.projectStatus}
        />
      )}
    </ContentsHeaderWrapper>
  );
};

export default LaunchpadDetailContentsHeader;
