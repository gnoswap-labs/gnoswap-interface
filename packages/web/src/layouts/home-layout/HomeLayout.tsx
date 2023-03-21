import React from "react";
import { wrapper } from "./HomeLayout.styles";

interface HomeLayoutProps {
  header: React.ReactNode;
  brand: React.ReactNode;
  swap: React.ReactNode;
  trending: React.ReactNode;
  highest: React.ReactNode;
  recently: React.ReactNode;
  tokenList: React.ReactNode;
  footer: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({
  header,
  brand,
  swap,
  trending,
  highest,
  recently,
  tokenList,
  footer,
}) => (
  <div css={wrapper}>
    {header}

    <div className="hero-section">
      <div className="brand-container">{brand}</div>
      <div className="swap-container">{swap}</div>

      <div className="card-list">
        {trending}
        {highest}
        {recently}
      </div>
    </div>
    <div className="tokens-section">{tokenList}</div>

    {footer}
  </div>
);

export default HomeLayout;
