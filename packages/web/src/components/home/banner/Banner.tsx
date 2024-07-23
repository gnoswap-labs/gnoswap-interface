import Button from "@components/common/button/Button";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { useTranslation } from "next-i18next";
import React from "react";
import { BannerContent } from "./Banner.styled";

const ONBOARDING_GUIDE_URL =
  "https://docs.gnoswap.io/references/onboarding-guide";

const Banner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BannerContent>
      <h4>{t("Main:lookingTo")}</h4>
      <p>{t("Main:followOur")}</p>
      <Button
        text={t("Main:projectOnb")}
        onClick={() => window.open(ONBOARDING_GUIDE_URL, "_blank")}
        rightIcon={<IconStrokeArrowRight className="arrow-icon" />}
        style={{
          bgColor: "background04",
          fontType: "body11",
          padding: "16px 40px",
          textColor: "border07",
        }}
        className="banner-button"
      />
    </BannerContent>
  );
};

export default Banner;
