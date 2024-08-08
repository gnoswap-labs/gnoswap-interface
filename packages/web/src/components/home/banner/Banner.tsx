import { useTranslation } from "next-i18next";
import React from "react";

import Button from "@components/common/button/Button";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { EXT_URL } from "@constants/external-url.contant";

import { BannerContent } from "./Banner.styled";

const Banner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BannerContent>
      <h4>{t("Main:lookingTo")}</h4>
      <p>{t("Main:followOur")}</p>
      <Button
        text={t("Main:projectOnb")}
        onClick={() => window.open(EXT_URL.DOCS.ONBOARDING, "_blank")}
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
