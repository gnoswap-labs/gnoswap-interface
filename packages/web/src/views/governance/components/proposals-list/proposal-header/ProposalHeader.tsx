import { Dispatch, SetStateAction } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNewTab from "@components/common/icons/IconNewTab";
import Switch from "@components/common/switch/Switch";

import { ProposalHeaderWrapper } from "./ProposalHeader.styles";
import { useTranslation } from "react-i18next";
import { EXT_URL } from "@constants/external-url.contant";

export interface ProposalHeaderProps {
  isShowActiveOnly: boolean;
  toggleIsShowActiveOnly: () => void;
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>;
  isDisabledCreateButton: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  setIsOpenCreateModal,
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
          onClick={() => setIsOpenCreateModal(true)}
        />
      </div>
    </ProposalHeaderWrapper>
  );
};

export default ProposalHeader;
