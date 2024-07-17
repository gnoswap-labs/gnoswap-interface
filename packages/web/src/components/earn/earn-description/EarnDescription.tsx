import React from "react";
import { EarnDescriptionWrapper } from "./EarnDescription.styles";
import IconArrowRight from "@components/common/icons/IconArrowRight";
import { useTranslation } from "react-i18next";

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
          <div className="link-wrapper">
            <span>{t("Earn:earnInstruction.about.goto")}</span>
            <IconArrowRight />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="title-wrapper">
          {t("Earn:earnInstruction.stake.title")}
        </div>
        <div className="content-wrapper">
          <div className="description-wrapper">
            <span
              className="text"
              dangerouslySetInnerHTML={{
                __html: t("Earn:earnInstruction.stake.subtitle", {
                  apr: "89%",
                }),
              }}
            />
            &nbsp;
            <span className="highlight">89% APR.</span>
          </div>
          <div className="link-wrapper">
            {t("Earn:earnInstruction.stake.goto")}
            <IconArrowRight />
          </div>
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
          <div className="link-wrapper">
            {t("Earn:earnInstruction.community.goto")}
            <IconArrowRight />
          </div>
        </div>
      </div>
    </EarnDescriptionWrapper>
  );
};

export default EarnDescription;
