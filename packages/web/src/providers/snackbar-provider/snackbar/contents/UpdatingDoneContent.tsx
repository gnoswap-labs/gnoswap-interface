import { useTranslation } from "react-i18next";

import IconNewTab from "@components/common/icons/IconNewTab";
import IconSuccess from "@components/common/icons/IconSuccess";
import { GnoscanDataType, useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

import { SnackbarContent } from "./type";

const UpdatingDoneContent: React.FC<{ content?: SnackbarContent }> = ({
  content,
}: {
  content?: SnackbarContent;
}) => {
  const { t } = useTranslation();
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>
          {content.title ? content.title : t("Modal:toast.updating.title")}
        </h5>
        <p className="waiting-confirmation">{t("Modal:toast.updating.desc")}</p>
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            {t("Modal:toast.pending.viewTx")} <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>{t("Modal:toast.updating.title")}</h5>
        <p className="waiting-confirmation">{t("Modal:toast.updating.desc")}</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          {t("Modal:toast.pending.viewTx")} <IconNewTab />
        </a>
      </div>
    </div>
  );
};

export { UpdatingDoneContent };
