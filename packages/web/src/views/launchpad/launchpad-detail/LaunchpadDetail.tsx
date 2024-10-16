import React from "react";

import { useLoading } from "@hooks/common/use-loading";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetLaunchpadProjectDetails } from "@query/launchpad/use-get-launchpad-project-details";

import LaunchpadDetailLayout from "./LaunchpadDetailLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import LaunchpadDetailContentsHeaderContainer from "./containers/launchpad-detail-contents-header-container/LaunchpadDetailContentsHeaderContainer";
import LaunchpadPoolListContainer from "./containers/launchpad-pool-list-container/LaunchpadPoolListContainer";
import LaunchpadProjectSummaryContainer from "./containers/launchpad-project-summary-container/LaunchpadProjectSummaryContainer";
import LaunchpadAboutProjectContainer from "./containers/launchpad-about-project-container/LaunchpadAboutProjectContainer";
import LaunchpadParticipateContainer from "./containers/launchpad-participate-container/LaunchpadParticipateContainer";
import LaunchpadMyParticipationContainer from "./containers/launchpad-my-participation-container/LaunchpadMyParticipationContainer";
import LaunchpadDetailClickHereContainer from "./containers/launchpad-detail-click-here-container/LaunchpadDetailClickHereContainer";
import Footer from "@components/common/footer/Footer";

export interface ProjectSummaryDataModel {
  totalAllocation: number;
  totalParticipants: number;
  totalDeposited: number;
  totalDistributed: number;
}

const LaunchpadDetail: React.FC = () => {
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();
  const { data } = useGetLaunchpadProjectDetails(projectPath);
  const { isLoading } = useLoading();
  const breadcrumbsSteps = React.useMemo(() => {
    return [
      {
        title: "Launchpad",
        path: "/launchpad",
      },
      {
        title: `${data?.name}` || "-",
        path: "",
      },
    ];
  }, [data?.name]);

  /**
   * @dev Launchpad Detail Contents-header section data
   */
  const contentsHeaderData = {
    name: data?.name || "-",
    projectStatus: data?.status || null,
  };

  /**
   * @dev Launchpad Project Summary section data
   */
  const projectSummaryData: ProjectSummaryDataModel = data?.pools?.reduce(
    (acc, project) => {
      acc.totalAllocation += project.allocation;
      acc.totalParticipants += project.participant;
      acc.totalDeposited += project.depositAmount;
      acc.totalDistributed += project.distributedAmount;
      return acc;
    },
    {
      totalAllocation: 0,
      totalParticipants: 0,
      totalDeposited: 0,
      totalDistributed: 0,
    },
  ) || {
    totalAllocation: 0,
    totalParticipants: 0,
    totalDeposited: 0,
    totalDistributed: 0,
  };

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
      contentsHeader={
        <LaunchpadDetailContentsHeaderContainer data={contentsHeaderData} />
      }
      poolList={<LaunchpadPoolListContainer pools={data?.pools || []} />}
      projectSummary={
        <LaunchpadProjectSummaryContainer data={projectSummaryData} />
      }
      aboutProject={<LaunchpadAboutProjectContainer />}
      participate={<LaunchpadParticipateContainer />}
      myParticipation={<LaunchpadMyParticipationContainer />}
      clickHere={<LaunchpadDetailClickHereContainer />}
      footer={<Footer />}
    />
  );
};

export default LaunchpadDetail;
