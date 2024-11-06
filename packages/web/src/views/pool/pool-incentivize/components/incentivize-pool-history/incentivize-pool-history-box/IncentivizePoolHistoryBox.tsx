import React from "react";
import { useTranslation, Trans } from "react-i18next";

import { IncentivizePoolHistoryBoxWrapper } from "./IncentivizePoolHistoryBox.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
// import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";

const IncentivizePoolHistoryBox = () => {
  const { t } = useTranslation();

  const renderDataMapping = () => {
    return (
      <>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.token")}
          </div>
          <div className="value">
            {/* <OverlapTokenLogo tokens={<div></div>} size={24} /> */}
            <span>GNS External</span>
            <Chip text="External" />
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.pool")}
          </div>
          <div className="value">
            <DoubleLogo left="" right="" size={24} />
            <span>GNS External</span>
            <Chip text="0.3%" height={24} />
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.startDate")}
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.endDate")}
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.incentivizedAmount")}
            <Tooltip
              FloatingContent={
                <Trans
                  ns="IncentivizePool"
                  components={{ br: <br /> }}
                  i18nKey={"incentiPool.history.tooltip.incentivizedAmount"}
                />
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.remainingAmount")}
            <Tooltip
              FloatingContent={
                <Trans
                  ns="IncentivizePool"
                  components={{ br: <br /> }}
                  i18nKey={"incentiPool.history.tooltip.remainingAmount"}
                />
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.unvestedAmount")}
            <Tooltip
              FloatingContent={
                <Trans
                  ns="IncentivizePool"
                  components={{ br: <br /> }}
                  i18nKey={"incentiPool.history.tooltip.unvestedAmount"}
                />
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.depositAmount")}
            <Tooltip
              FloatingContent={
                <Trans
                  ns="IncentivizePool"
                  components={{ br: <br /> }}
                  i18nKey={"incentiPool.history.tooltip.depositAmount"}
                />
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">GNS External</div>
        </div>

        <div className="button-wrapper">
          <Button
            text={"Claim"}
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
          />
        </div>
      </>
    );
  };

  return (
    <IncentivizePoolHistoryBoxWrapper>
      {renderDataMapping()}
    </IncentivizePoolHistoryBoxWrapper>
  );
};

interface ChipProps {
  text: string;
  height?: number;
}

const Chip = ({ text, height }: ChipProps) => {
  return (
    <div className="chip" style={{ height: height ? height : "none" }}>
      {text}
    </div>
  );
};

export default IncentivizePoolHistoryBox;
