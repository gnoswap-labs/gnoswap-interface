import React from "react";
import { wrapper } from "./DashboardLayout.styles";

interface DashboradLayoutProps {
  header: React.ReactNode;
  tvl: React.ReactNode;
  volume: React.ReactNode;
  info: React.ReactNode;
  activities: React.ReactNode;
  footer: React.ReactNode;
}

const DashboardLayout: React.FC<DashboradLayoutProps> = ({
  header,
  tvl,
  volume,
  info,
  activities,
  footer,
}) => (
  <main css={wrapper}>
    {header}
    <section className="dashboard-section">
      <div className="container title-container">
        <h3 className="title">Dashboard</h3>
      </div>
      <div className="container charts-container">
        {tvl}
        {volume}
      </div>
      <div className="container dashboard-info-container">{info}</div>
    </section>
    <div className="background-wrapper">
      <div className="background"></div>
      <section className="activities-section">
        <div className="container activities-container">{activities}</div>
      </section>
    </div>
    {footer}
  </main>
);

export default DashboardLayout;
