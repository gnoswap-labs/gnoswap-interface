import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNote from "@components/common/icons/IconNote";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import LearnMoreModal from "../learn-more-modal/LearnMoreModal";
import { StakingHeaderWrapper } from "./StakingHeader.styles";
import { useState } from "react";
interface StakingHeaderProps {
  breakpoint: DEVICE_TYPE;
}

const StakingHeader: React.FC<StakingHeaderProps> = ({ breakpoint }) => {
  const [isShowLearnModal, setIsShowLearnModal] = useState(false);
  return (
    <StakingHeaderWrapper>
      <div className="left-wrap">
        <h2>Staking</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE && (
          <div className="logo-wrap">
            <span className="lean-more" onClick={() => setIsShowLearnModal(true)}>
              Learn More
            </span>
            <IconNote className="icon-logo" />
          </div>
        )}
      </div>
      <div className="button-wrap">
        <Button
          text="Unstake"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fullWidth: true,
            height: 36,
            padding: "0px 16px",
            fontType: "p1",
          }}
        />
        <Button
          text="Stake"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fullWidth: true,
            height: 36,
            padding: "0px 16px",
            fontType: "p1",
          }}
        />
      </div>
      {isShowLearnModal && <LearnMoreModal setIsShowLearnMoreModal={setIsShowLearnModal} />}
    </StakingHeaderWrapper>
  );
};

export default StakingHeader;
