import React from "react";
import { useAtom } from "jotai";

import { useLoading } from "@hooks/common/use-loading";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetLaunchpadProjectDetails } from "@query/launchpad/use-get-launchpad-project-details";
import { useGetLaunchpadParticipationInfos } from "@query/launchpad/use-get-launchpad-participation-infos";
import { useWallet } from "@hooks/wallet/use-wallet";
import { LaunchpadProjectDetailsModel } from "@models/launchpad";
import { LaunchpadState } from "@states/index";

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
type InputObject = {
  [K in keyof LaunchpadProjectDetailsModel]: LaunchpadProjectDetailsModel[K];
};

interface OutputObject {
  [key: string]: string;
}

export interface ProjectLinksObject {
  [key: string]: string;
}

export interface ProjectDescriptionDataModel {
  description: string;
  descriptionDetails: string;
  realmPath: string;
  links: ProjectLinksObject;
}

const LaunchpadDetail: React.FC = () => {
  const [selectPoolId, setSelectPoolId] = useAtom(
    LaunchpadState.selectLaunchpadPool,
  );

  const router = useCustomRouter();
  const projectPath = router.getProjectPath();
  const { account } = useWallet();

  const { data: projectDetailData, refetch: projectDetailRefetch } =
    useGetLaunchpadProjectDetails(projectPath);
  const refetchProjectDetail = async () => {
    await projectDetailRefetch();
  };
  const { isLoading } = useLoading();
  const breadcrumbsSteps = React.useMemo(() => {
    return [
      {
        title: "Launchpad",
        path: "/launchpad",
      },
      {
        title: `${projectDetailData?.name}` || "-",
        path: "",
      },
    ];
  }, [projectDetailData?.name]);

  /**
   * @dev Launchpad Detail Contents-header section data
   */
  const contentsHeaderData = {
    name: projectDetailData?.name || "-",
    projectStatus: projectDetailData?.status || null,
  };

  /**
   * @dev Launchpad Project Summary section data
   */
  const projectSummaryData: ProjectSummaryDataModel =
    projectDetailData?.pools?.reduce(
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

  /**
   * @dev Launchpad Project Description(about) section data
   */
  const [linksInfo, setLinksInfo] = React.useState({});

  function transformUrls(input: InputObject): OutputObject {
    const output: OutputObject = {};

    for (const [key, value] of Object.entries(input)) {
      if (key.endsWith("Url") && typeof value === "string") {
        const newKey = key.slice(0, -3);
        output[newKey] = value.trim();
      }
    }

    return output;
  }

  React.useEffect(() => {
    if (projectDetailData) {
      setLinksInfo(() => transformUrls(projectDetailData));
    }
  }, [projectDetailData]);

  const projectDescriptionData: ProjectDescriptionDataModel = {
    description: projectDetailData?.description || "-",
    descriptionDetails: projectDetailData?.descriptionDetails || "-",
    realmPath: projectPath || "-",
    links: linksInfo,
  };

  /**
   * @dev
   */
  const selectProjectPool = React.useCallback(
    (poolId: number) => {
      setSelectPoolId(poolId);
    },
    [setSelectPoolId],
  );

  const currentSelectProjectPoolInfo = React.useMemo(() => {
    return projectDetailData?.pools.find(pool => pool.id === selectPoolId);
  }, [selectPoolId, projectDetailData?.pools]);

  /**
   * @dev Launchpad My Participation section data
   */
  const { data: myParticipationData } = useGetLaunchpadParticipationInfos(
    projectPath as string,
    account?.address as string,
    { enabled: !!projectPath && !!account?.address },
  );

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
      poolList={
        <LaunchpadPoolListContainer
          pools={projectDetailData?.pools || []}
          selectProjectPool={selectProjectPool}
        />
      }
      projectSummary={
        <LaunchpadProjectSummaryContainer
          tokenSymbol={projectDetailData?.rewardTokenSymbol || "-"}
          data={projectSummaryData}
        />
      }
      aboutProject={
        <LaunchpadAboutProjectContainer data={projectDescriptionData} />
      }
      participate={
        <LaunchpadParticipateContainer
          poolInfo={currentSelectProjectPoolInfo}
          refetch={refetchProjectDetail}
        />
      }
      myParticipation={
        <LaunchpadMyParticipationContainer data={myParticipationData || []} />
      }
      clickHere={<LaunchpadDetailClickHereContainer />}
      footer={<Footer />}
    />
  );
};

export default LaunchpadDetail;
