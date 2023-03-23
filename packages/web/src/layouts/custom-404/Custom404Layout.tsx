import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import React from "react";
import { wrapper } from "./Custom404Layout.styles";

interface Custom404LayoutProps {
  header: React.ReactNode;
  icon404: React.ReactNode;
  goBackClick: () => void;
  footer: React.ReactNode;
}

const Custom404Layout: React.FC<Custom404LayoutProps> = ({
  header,
  icon404,
  goBackClick,
  footer,
}) => (
  <div css={wrapper}>
    {header}
    <main>
      {icon404}
      <div className="content-section">
        <strong>404</strong>
        <p>We lost that page...</p>
        <Button
          leftIcon={<IconStrokeArrowLeft className="arrow-icon" />}
          text="Go back"
          onClick={goBackClick}
          style={{
            hierarchy: ButtonHierarchy.Dark,
            width: 240,
            height: 57,
          }}
        />
      </div>
    </main>
    {footer}
  </div>
);

export default Custom404Layout;
