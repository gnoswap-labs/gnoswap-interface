import { Trans, useTranslation } from "react-i18next";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import { EXT_URL } from "@constants/external-url.contant";

import { IconButton, wrapper } from "./Disclaimer.styles";

const Disclaimer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h5 className="section-title">{t("IncentivizePool:disclaimer.title")}</h5>
      <div className="desc">
        <Trans
          ns="IncentivizePool"
          i18nKey={"IncentivizePool:disclaimer.description"}
          components={{
            docs_link: (
                <IconButton
                  onClick={() => {
                    window.open(EXT_URL.DOCS.WARMUP, "_blank");
                  }}
                  style={{display: "inline-block"}}
                >
                  <IconOpenLink className="action-icon" />
                </IconButton>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Disclaimer;
