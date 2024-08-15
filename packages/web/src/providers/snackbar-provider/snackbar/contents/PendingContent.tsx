import { useTranslation } from "react-i18next";

import IconNewTab from "@components/common/icons/IconNewTab";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { GnoscanDataType, useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

import { SnackbarContent } from "./type";

const PendingContent: React.FC<{ content?: SnackbarContent }> = ({
  content,
}: {
  content?: SnackbarContent;
}) => {
  const { t } = useTranslation();
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <LoadingSpinner className="loading-icon" />
      <div>
        <h5>
          {content.title ? content.title : t("Modal:toast.pending.title")}
        </h5>
        <p className="waiting-confirmation">{t("Modal:toast.pending.desc")}</p>
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            {t("Modal:toast.pending.viewTx")} <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <LoadingSpinner className="loading-icon" />
      <div>
        <h5>{t("Modal:toast.pending.title")}</h5>
        <p className="waiting-confirmation">{t("Modal:toast.pending.desc")}</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          {t("Modal:toast.pending.viewTx")} <IconNewTab />
        </a>
      </div>
    </div>
  );
};

export { PendingContent };
