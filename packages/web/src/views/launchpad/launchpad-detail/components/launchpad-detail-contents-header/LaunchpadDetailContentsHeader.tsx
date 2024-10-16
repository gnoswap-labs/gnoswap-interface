/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import IconTimer from "@components/common/icons/IconTimer";
import { ContentsHeaderWrapper } from "./LaunchpadDetailContentsHeader.styles";
import { capitalize } from "@utils/string-utils";

interface LaunchpadDetailContentsHeaderProps {
  projectName: string;
  projectStatus: string | null;
}

const LaunchpadDetailContentsHeader: React.FC<
  LaunchpadDetailContentsHeaderProps
> = ({ projectName, projectStatus }) => {
  return (
    <ContentsHeaderWrapper className="contents-header">
      <div className="symbol-icon">
        <img src="/gns.svg" alt="token symbol image" />
      </div>
      <div className="project-name">{projectName}</div>
      <div className="project-status">
        {projectStatus && (
          <>
            <IconTimer type={projectStatus} /> {capitalize(projectStatus)}
          </>
        )}
      </div>
    </ContentsHeaderWrapper>
  );
};

export default LaunchpadDetailContentsHeader;
