import React, { ReactNode } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import {
  InfoBoxTooltipContent,
  GovernanceDetailInfoWrapper
} from "./InfoBox.styles";

interface GovernanceDetailInfoProps {
  title: string;
  value: ReactNode;
  tooltip?: string;
  isLoading: boolean;
  titleButton?: {
    text: ReactNode;
    onClick: () => void;
  };
  valueButton?: {
    text: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
}

const InfoBox: React.FC<GovernanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  isLoading,
  titleButton,
  valueButton,
}) => {
  return (
    <GovernanceDetailInfoWrapper>
      <div className="title-wrapper">
        <span className="title">
          {title}
          {tooltip !== undefined && (
            <Tooltip
              placement="top"
              FloatingContent={
                <InfoBoxTooltipContent>
                  {tooltip}
                </InfoBoxTooltipContent>
              }
            >
              <IconInfo />
            </Tooltip>
          )}
        </span>
        {titleButton && (
          <div className="title-button" onClick={titleButton.onClick}>
            {titleButton.text}
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="value-wrapper-skeleton">
          <span css={pulseSkeletonStyle({ w: "100%" })} />
        </div>
      ) : (
        <div className="value-wrapper">
          <span className="value">{value}</span>
          {valueButton && (
            <Button
              className="value-button"
              text={valueButton.text}
              disabled={valueButton.disabled}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fontType: "p1",
              }}
              onClick={valueButton.onClick}
            />
          )}
        </div>
      )}
    </GovernanceDetailInfoWrapper>
  );
};


export default InfoBox;
