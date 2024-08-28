import React, { ReactNode } from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import {
  GovernanceDetailInfoTooltipContent,
  GovernanceDetailInfoWrapper
} from "./GovernanceDetailInfo.styles";

interface GovernanceDetailInfoProps {
  title: string;
  value: ReactNode;
  tooltip?: string;
  isLoading: boolean;
}

const GovernanceDetailInfo: React.FC<GovernanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  isLoading,
}) => {
  return (
    <GovernanceDetailInfoWrapper>
      <div className="title-wrapper">
        <span className="title">{title}</span>
        {tooltip !== undefined && (
          <Tooltip
            placement="top"
            FloatingContent={
              <GovernanceDetailInfoTooltipContent>
                {tooltip}
              </GovernanceDetailInfoTooltipContent>
            }
          >
            <IconInfo />
          </Tooltip>
        )}
      </div>
      {isLoading ? (
        <div className="value-wrapper-skeleton">
          <span css={pulseSkeletonStyle({ w: "100%" })} />
        </div>
      ) : (
        <div className="value-wrapper">
          <span className="value">{value}</span>
        </div>
      )}
    </GovernanceDetailInfoWrapper>
  );
};


export default GovernanceDetailInfo;
