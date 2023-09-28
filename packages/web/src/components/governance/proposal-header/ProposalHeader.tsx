import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconFile from "@components/common/icons/IconFile";
import Switch from "@components/common/switch/Switch";
import { ProposalHeaderWrapper } from "./ProposalHeader.styles";

interface ProposalHeaderProps {
  isShowCancelled: boolean;
  toggleShowCancelled: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  isShowCancelled,
  toggleShowCancelled,
}) => (
  <ProposalHeaderWrapper>
    <div className="title-header">
      <h2>Proposals</h2>
      <div className="sub-title">
        <p>Go to Forum</p>
        <IconFile />
      </div>
    </div>
    <div className="switch-button">
      <Switch
        checked={isShowCancelled}
        onChange={toggleShowCancelled}
        hasLabel={true}
        labelText="Show Cancelled"
      />
      <Button
        text="Create Proposal"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fontType: "p1",
        }}
        onClick={() => {}}
      />
    </div>
  </ProposalHeaderWrapper>
);

export default ProposalHeader;
