import React from "react";

import { useLoading } from "@hooks/common/use-loading";

import LaunchpadDetailLayout from "./LaunchpadDetailLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import LaunchpadPoolListContainer from "./containers/launchpad-pool-list-container/LaunchpadPoolListContainer";
import LaunchpadProjectSummaryContainer from "./containers/launchpad-project-summary-container/LaunchpadProjectSummaryContainer";
import LaunchpadAboutProjectContainer from "./containers/launchpad-about-project-container/LaunchpadAboutProjectContainer";
import LaunchpadParticipateContainer from "./containers/launchpad-participate-container/LaunchpadParticipateContainer";
import LaunchpadMyParticipationContainer from "./containers/launchpad-my-participation-container/LaunchpadMyParticipationContainer";

const LaunchpadDetail: React.FC = () => {
  const { isLoading } = useLoading();
  const breadcrumbsSteps = React.useMemo(() => {
    return [
      {
        title: "Launchpad",
        path: "/launchpad",
      },
      {
        title: "GnoSwap Protocol",
        path: "",
      },
    ];
  }, []);
  return (
    <LaunchpadDetailLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={breadcrumbsSteps}
          isLoading={isLoading}
          w="102px"
        />
      }
      poolList={<LaunchpadPoolListContainer />}
      projectSummary={<LaunchpadProjectSummaryContainer />}
      aboutProject={<LaunchpadAboutProjectContainer />}
      participate={<LaunchpadParticipateContainer />}
      myParticipation={<LaunchpadMyParticipationContainer />}
    />
  );
};

export default LaunchpadDetail;
