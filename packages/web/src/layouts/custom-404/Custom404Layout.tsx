import Button from "@components/common/button/Button";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import React from "react";
import { wrapper } from "./Custom404Layout.styles";

interface Custom404LayoutProps {
  header: React.ReactNode;
  icon404: React.ReactNode;
  goBackClick: () => void;
  footer: React.ReactNode;
  themeKey: "dark" | "light";
}

const Custom404Layout: React.FC<Custom404LayoutProps> = ({
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
        <strong>404</strong>
        <p>Page not found!</p>
        <Button
          leftIcon={<IconStrokeArrowLeft className="btn-arrow-icon" />}
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

export default Custom404Layout;
