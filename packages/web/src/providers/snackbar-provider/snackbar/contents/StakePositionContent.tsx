import { useTranslation } from "react-i18next";

import IconArrowRight from "@components/common/icons/IconArrowRight";
import { Image } from "@components/common/missing-logo/MissingLogo.styles";
import { sanitizeHtml } from "@utils/sanitize-html";
import { SnackbarContent } from "./type";

const StakePositionContent: React.FC<{ content?: SnackbarContent; onClick: () => void; close: () => void }> = ({
  content,
  onClick,
  close,
}) => {
  const { t } = useTranslation();

  const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onClick();
    close();
  };

  return (
    <div className="notice-body clickable" onClick={onClick}>
      <div className="icon-wrap-wrapper">
        <Image mobileWidth={24} width={36} src={content?.logoUrl || ""} alt="logo" />
      </div>
      <div>
        <div>
          <h5>{content?.title ? content.title : t("Modal:toast.stake-position.title")}</h5>
          <p
            className="description"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(content?.description || t("Modal:toast.stake-position.desc")),
            }}
          />
          <a onClick={content?.onClickLink || onClickLink}>
            {t("Modal:toast.stake-position.link")} <IconArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export { StakePositionContent };
