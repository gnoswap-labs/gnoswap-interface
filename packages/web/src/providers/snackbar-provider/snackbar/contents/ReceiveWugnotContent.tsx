import { useTranslation } from "react-i18next";

import { GNOT_UNIT_DENOM } from "@common/values/token-constant";
import IconArrowRight from "@components/common/icons/IconArrowRight";
import IconWrap from "@components/common/icons/IconWrap";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { sanitizeHtml } from "@utils/sanitize-html";
import { SnackbarContent } from "./type";

const ReceiveWugnotContent: React.FC<{ content?: SnackbarContent; onClick: () => void; close: () => void }> = ({
  content,
  onClick,
  close,
}) => {
  const { t } = useTranslation();

  const getUnwrapUrl = () => {
    const fromPath = WRAPPED_GNOT_PATH;
    const toPath = GNOT_UNIT_DENOM;

    return `/swap?from=${fromPath}&to=${toPath}`;
  };

  return (
    <div className="notice-body clickable" onClick={onClick}>
      <div className="icon-wrap-wrapper">
        <IconWrap className="icon-wrap" />
      </div>
      <div>
        <h5>{content?.title ? content.title : t("Modal:toast.receive-wugnot.title")}</h5>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content?.description || t("Modal:toast.receive-wugnot.title")),
          }}
        />
        <a
          href={getUnwrapUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => {
            e.stopPropagation();
            close();
          }}
        >
          {t("Modal:toast.receive-wugnot.link")} <IconArrowRight />
        </a>
      </div>
    </div>
  );
};

export { ReceiveWugnotContent };
