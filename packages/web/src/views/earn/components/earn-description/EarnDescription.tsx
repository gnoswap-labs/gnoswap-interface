import React from "react";
import { Trans, useTranslation } from "react-i18next";

import IconArrowRight from "@components/common/icons/IconArrowRight";
import { DEFAULT_POOL_PATH } from "@constants/common.constant";
import { EXT_URL } from "@constants/external-url.contant";

import { EarnDescriptionWrapper } from "./EarnDescription.styles";

const EarnDescription: React.FC = () => {
  const { t } = useTranslation();

  return (
    <EarnDescriptionWrapper>
      <div className="card">
        <div className="title-wrapper">
          {t("Earn:earnInstruction.about.title")}
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            {t("Earn:earnInstruction.about.subtitle")}
          </div>
          <a
            className="link-wrapper"
            href={EXT_URL.DOCS.USER_GUIDE.PROVIDING_LIQUIDITY}
            target="_blank"
          >
            <span>{t("Earn:earnInstruction.about.goto")}</span>
            <IconArrowRight />
          </a>
        </div>
      </div>

      <div className="card">
        <div className="title-wrapper">
          {t("Earn:earnInstruction.stake.title")}
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            <Trans
              i18nKey="Earn:earnInstruction.stake.subtitle"
              components={{
                docs: (
                  <a
                    className="docs"
                    href={EXT_URL.DOCS.USER_GUIDE.STAKE_POSITIONS}
                    target="_blank"
                  />
                ),
                highlight: <span className="highlight" />,
              }}
              // TODO: update with best APR
              values={{ apr: "89%" }}
            />
          </div>
          <a
            className="link-wrapper"
            // TODO: update with best APR
            href={`/earn/pool?poolPath=${DEFAULT_POOL_PATH}#staking`}
          >
            {t("Earn:earnInstruction.stake.goto")}
            <IconArrowRight />
          </a>
        </div>
      </div>

      <div className="card">
        <div className="title-wrapper">
          {t("Earn:earnInstruction.community.title")}
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            {t("Earn:earnInstruction.community.subtitle")}
          </div>
          <a
            className="link-wrapper"
            href={EXT_URL.SOCIAL.DISCORD}
            target="_blank"
          >
            {t("Earn:earnInstruction.community.goto")}
            <IconArrowRight />
          </a>
        </div>
      </div>
    </EarnDescriptionWrapper>
  );
};

export default EarnDescription;
