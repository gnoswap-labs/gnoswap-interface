import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNewTab from "@components/common/icons/IconNewTab";
import Switch from "@components/common/switch/Switch";

import { EXT_URL } from "@constants/external-url.contant";
import { useTranslation } from "react-i18next";
import { ProposalHeaderWrapper } from "./ProposalHeader.styles";

export interface ProposalHeaderProps {
  isShowActiveOnly: boolean;
  toggleIsShowActiveOnly: () => void;
  onClickCreateProposal: () => void;
  isDisabledCreateButton: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  onClickCreateProposal,
  isDisabledCreateButton,
}) => {
  const { t } = useTranslation();

  return (
    <ProposalHeaderWrapper>
      <div className="header-title">
        {t("Governance:proposalList.header.title")}
        <a href={EXT_URL.SOCIAL.DISCORD} target="_blank" className="sub-title">
          {t("Governance:proposalList.header.link")}
          <IconNewTab />
        </a>
      </div>
      <div className="switch-cta-wrapper">
        <Switch
          checked={isShowActiveOnly}
          onChange={toggleIsShowActiveOnly}
          hasLabel={true}
          labelText={t("Governance:proposalList.header.toggle")}
        />
        <Button
          disabled={isDisabledCreateButton}
          text={t("Governance:proposalList.header.btn")}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
          }}
          onClick={onClickCreateProposal}
        />
      </div>
    </ProposalHeaderWrapper>
  );
};

export default ProposalHeader;
