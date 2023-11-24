import Button from "@components/common/button/Button";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import React from "react";
import { BannerContent } from "./Banner.styled";

const Banner: React.FC = () => {
  return (
    <BannerContent>
      <h4>Looking to get started on Gnoswap?</h4>
      <p>
        Follow our simple guide to start building liquidity for your project.
      </p>
      <Button
        text="Project Onboarding Guide"
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
