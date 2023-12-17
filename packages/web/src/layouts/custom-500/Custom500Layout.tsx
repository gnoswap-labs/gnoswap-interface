import Button from "@components/common/button/Button";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import React from "react";
import { wrapper } from "./Custom500Layout.styles";

interface Custom500LayoutProps {
  header: React.ReactNode;
  icon404: React.ReactNode;
  goBackClick: () => void;
  footer: React.ReactNode;
  themeKey: "dark" | "light";
}

const Custom500Layout: React.FC<Custom500LayoutProps> = ({
  header,
  icon404,
  goBackClick,
  footer,
  themeKey,
}) => (
  <div css={wrapper}>
    {header}
    <main>
      {icon404}
      <div className="content-section">
        <strong>We’ll be right back.</strong>
        <p>
          We’re currently experiencing technical issues. <br />
          Please check back soon.
        </p>
        <Button
          leftIcon={<IconStrokeArrowLeft className="arrow-icon" />}
          text="Go back"
          onClick={goBackClick}
          style={{
            bgColor: themeKey === "dark" ? "background02" : "background04",
            textColor: "text20",
            width: 240,
            height: 57,
            arrowColor: "icon15",
          }}
          className="button-404"
        />
      </div>
    </main>
    {footer}
  </div>
);

export default Custom500Layout;
