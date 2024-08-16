import { useTranslation } from "react-i18next";

import IconNewTab from "@components/common/icons/IconNewTab";
import IconSuccess from "@components/common/icons/IconSuccess";
import { GnoscanDataType, useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

import { SnackbarContent } from "./type";

const SuccessContent: React.FC<{ content?: SnackbarContent }> = ({ content }) => {
  const { t } = useTranslation();
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>
          {content.title} - {t("Modal:toast.success.title")}
        </h5>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: content.description || "" }}
        />
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            {t("Modal:toast.success.viewTx")} <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>{t("Modal:toast.success.title")}</h5>
        <p>{t("Modal:toast.success.defaultDesc")}</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          {t("Modal:toast.success.viewTx")} <IconNewTab />
        </a>
      </div>
    </div>
  );
};

export { SuccessContent };
