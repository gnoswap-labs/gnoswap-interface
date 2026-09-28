import { useState } from "react";
import { useTranslation } from "react-i18next";

import IconArrowRightLine from "@components/common/icons/IconArrowRightLine";
import IconLpToken from "@components/common/icons/IconLpToken";
import { Image } from "@components/common/missing-logo/MissingLogo.styles";
import { sanitizeHtml } from "@utils/sanitize-html";
import { SnackbarContent } from "./type";

const StakePositionContent: React.FC<{ content?: SnackbarContent; onClick: () => void; close: () => void }> = ({
  content,
  onClick,
  close,
}) => {
  const { t } = useTranslation();
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const logoUrl = content?.logoUrl;

  const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    close();

    if (content?.onClickLink) {
      content.onClickLink();
      return;
    }

    onClick();
  };

  return (
    <div className="notice-body" onClick={onClick}>
      <div className="icon-wrap-wrapper nft-image-wrapper">
        {logoUrl && failedLogoUrl !== logoUrl ? (
          <Image
            className="nft-image"
            mobileWidth={20}
            width={32}
            src={logoUrl}
            alt=""
            onError={() => setFailedLogoUrl(logoUrl)}
          />
        ) : (
          <IconLpToken className="nft-image" />
        )}
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
          <a className="link" onClick={onClickLink}>
            {t("Modal:toast.stake-position.link")} <IconArrowRightLine />
          </a>
        </div>
      </div>
    </div>
  );
};

export { StakePositionContent };
