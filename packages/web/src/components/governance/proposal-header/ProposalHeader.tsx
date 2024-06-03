import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNewTab from "@components/common/icons/IconNewTab";
import Switch from "@components/common/switch/Switch";
import { ProposalHeaderWrapper } from "./ProposalHeader.styles";
import { Dispatch, SetStateAction } from "react";

interface ProposalHeaderProps {
  isShowCancelled: boolean;
  toggleShowCancelled: () => void;
  setIsShowCreateProposal: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  isShowCancelled,
  toggleShowCancelled,
  setIsShowCreateProposal,
  isConnected,
  isSwitchNetwork,
}) => (
  <ProposalHeaderWrapper>
    <div className="title-header">
      <h2>Proposals</h2>
      <a href="/" target="_blank" className="sub-title">
        <p>Go to Forum</p>
        <IconNewTab />
      </a>
    </div>
    <div className="switch-button">
      <Switch
        checked={isShowCancelled}
        onChange={toggleShowCancelled}
        hasLabel={true}
        labelText="Show Cancelled"
      />
      <Button
        disabled={!isConnected || isSwitchNetwork}
        text="Create Proposal"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fontType: "p1",
        }}
        onClick={() => setIsShowCreateProposal(true)}
      />
    </div>
  </ProposalHeaderWrapper>
);

export default ProposalHeader;
