import { useTranslation } from "react-i18next";

import IconFailed from "@components/common/icons/IconFailed";
import IconNewTab from "@components/common/icons/IconNewTab";
import { GnoscanDataType, useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

import { SnackbarContent } from "./type";

const FailContent: React.FC<{ content?: SnackbarContent }> = ({
  content,
}: {
  content?: SnackbarContent;
}) => {
  const { t } = useTranslation();
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <IconFailed className="icon-success" />
      <div>
        <h5>
          {content.title} - {t("Modal:toast.failed.title")}
        </h5>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: content.description || "" }}
        />
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            {t("Modal:toast.failed.viewTx")} <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <IconFailed className="icon-success" />
      <div>
        <h5>{t("Modal:toast.failed.title")}</h5>
        <p>{t("Modal:toast.failed.desc")}</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          {t("Modal:toast.failed.viewTx")} <IconNewTab />
        </a>
      </div>
    </div>
  );
};

export { FailContent };
