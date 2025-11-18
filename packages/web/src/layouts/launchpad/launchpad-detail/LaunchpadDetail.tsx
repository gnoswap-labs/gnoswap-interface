import React from "react";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetLaunchpadProjectDetails } from "@query/launchpad/use-get-launchpad-project-details";
import { useGetLaunchpadParticipationInfos } from "@query/launchpad/use-get-launchpad-participation-infos";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { LaunchpadProjectDetailsModel } from "@models/launchpad";
import { LaunchpadState } from "@states/index";
import { useTokenData } from "@hooks/token/data/use-token-data";

import LaunchpadDetailLayout from "./LaunchpadDetailLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer, { BreadcrumbTypes } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import LaunchpadDetailContentsHeaderContainer from "./containers/launchpad-detail-contents-header-container/LaunchpadDetailContentsHeaderContainer";
import LaunchpadPoolListContainer from "./containers/launchpad-pool-list-container/LaunchpadPoolListContainer";
import LaunchpadProjectSummaryContainer from "./containers/launchpad-project-summary-container/LaunchpadProjectSummaryContainer";
import LaunchpadAboutProjectContainer from "./containers/launchpad-about-project-container/LaunchpadAboutProjectContainer";
import LaunchpadParticipateContainer from "./containers/launchpad-participate-container/LaunchpadParticipateContainer";
import LaunchpadMyParticipationContainer from "./containers/launchpad-my-participation-container/LaunchpadMyParticipationContainer";
import LaunchpadDetailClickHereContainer from "./containers/launchpad-detail-click-here-container/LaunchpadDetailClickHereContainer";
import Footer from "@components/common/footer/Footer";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PAGE_PATH } from "@constants/page.constant";
import { useAddress } from "@hooks/common/use-address";

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
  name: string;
  description: string;
  descriptionDetails: string;
  realmPath: string;
  links: ProjectLinksObject;
}

export interface ProjectRewardInfoModel {
  rewardTokenPath: string;
  rewardTokenDecimals: number;
  rewardTokenSymbol: string;
  rewardTokenLogoURL: string;
}

const LaunchpadDetail: React.FC = () => {
  const { t } = useTranslation();
  const { connected } = useAddress();

  const [selectPoolId, setSelectPoolId] = useAtom(LaunchpadState.selectLaunchpadPool);
  const [, setDepositConditions] = useAtom(LaunchpadState.depositConditions);
  const { updateBalances, refetchGrc20Balances } = useTokenData();

  const { breakpoint } = useWindowSize();
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();
  const { account } = useWallet();

  const {
    data: projectDetailData,
    refetch: projectDetailRefetch,
    isFetched: isFetchedProjectDetail,
    isLoading: isLoadingProjectDetail,
  } = useGetLaunchpadProjectDetails(projectPath);

  const breadcrumbsSteps = React.useMemo(() => {
    const title = breakpoint === "mobile" ? "..." : t("Launchpad:launchpad");
    return [
      {
        title: title,
        path: PAGE_PATH.LAUNCHPAD,
        options: {
          type: "LAUNCHPAD" as BreadcrumbTypes,
        },
      },
      {
        title: `${projectDetailData?.name}` || "-",
        path: "",
      },
    ];
  }, [projectDetailData?.name, t, breakpoint]);

  /**
   * @dev Launchpad Detail Contents-header section data
   */
  const projectStartTime = projectDetailData?.pools[0].startTime;
  const projectEndTime = projectDetailData?.pools[2].endTime;

  const contentsHeaderData = {
    name: projectDetailData?.name || "-",
    projectStatus: projectDetailData?.status || null,
    startTime: projectStartTime,
    endTime: projectEndTime,
  };

  /**
   * @dev Launchpad Project Summary section data
   */
  const projectSummaryData: ProjectSummaryDataModel = projectDetailData?.pools?.reduce(
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

  const URL_SUFFIX = "Url";

  function transformUrls(input: InputObject): OutputObject {
    const output: OutputObject = {};

    for (const [key, value] of Object.entries(input)) {
      if (key.endsWith(URL_SUFFIX) && typeof value === "string") {
        const newKey = key.slice(0, -URL_SUFFIX.length);
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
    name: projectDetailData?.name || "-",
    description: projectDetailData?.description || "-",
    descriptionDetails: projectDetailData?.descriptionDetails || "-",
    realmPath: projectPath || "-",
    links: linksInfo,
  };

  /**
   * @dev Launchpad Participate section data
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

  const projectRewardInfo: ProjectRewardInfoModel = React.useMemo(() => {
    const initProjectRewardInfo = {
      rewardTokenPath: "",
      rewardTokenDecimals: 0,
      rewardTokenSymbol: "",
      rewardTokenLogoURL: "",
    };

    if (!projectDetailData) return initProjectRewardInfo;

    return {
      rewardTokenPath: projectDetailData.rewardTokenPath ?? initProjectRewardInfo.rewardTokenPath,
      rewardTokenDecimals: projectDetailData.rewardTokenDecimals ?? initProjectRewardInfo.rewardTokenDecimals,
      rewardTokenSymbol: projectDetailData.rewardTokenSymbol ?? initProjectRewardInfo.rewardTokenSymbol,
      rewardTokenLogoURL: projectDetailData.rewardTokenLogoURL ?? initProjectRewardInfo.rewardTokenLogoURL,
    };
  }, [projectDetailData]);

  /**
   * @dev Launchpad My Participation section data
   */
  const { data: myParticipationData, refetch: myParticipationRefetch } = useGetLaunchpadParticipationInfos(
    projectPath as string,
    account?.address as string,
    { enabled: !!projectPath && !!account?.address },
  );

  /**
   * @dev Refetchs
   */
  const refetchProjectDetail = async () => {
    await projectDetailRefetch();
    await myParticipationRefetch();
    await refetchGrc20Balances();
    await updateBalances();
  };
  const refetchClaimAll = async () => {
    await projectDetailRefetch();
    await myParticipationRefetch();
    await refetchGrc20Balances();
    await updateBalances();
  };

  React.useEffect(() => {
    if (projectDetailData && projectDetailData.conditions.length === 0) {
      setDepositConditions([]);
    }
    if (projectDetailData && projectDetailData.conditions.length > 0) {
      setDepositConditions(projectDetailData.conditions);
    }
  }, [projectDetailData, projectPath, setDepositConditions]);

  return (
    <LaunchpadDetailLayout
      breakpoint={breakpoint}
      header={<HeaderContainer />}
      status={projectDetailData?.status || ""}
      breadcrumbs={
        <BreadcrumbsContainer listBreadcrumb={breadcrumbsSteps} isLoading={isLoadingProjectDetail} w="102px" />
      }
      contentsHeader={
        <LaunchpadDetailContentsHeaderContainer
          data={contentsHeaderData}
          rewardInfo={projectRewardInfo}
          isLoading={isLoadingProjectDetail}
        />
      }
      poolList={
        <LaunchpadPoolListContainer
          pools={projectDetailData?.pools || []}
          selectProjectPool={selectProjectPool}
          status={projectDetailData?.status || ""}
          rewardInfo={projectRewardInfo}
          isLoading={isLoadingProjectDetail}
        />
      }
      projectSummary={
        <LaunchpadProjectSummaryContainer
          tokenSymbol={projectDetailData?.rewardTokenSymbol || "-"}
          rewardInfo={projectRewardInfo}
          data={projectSummaryData}
          isLoading={isLoadingProjectDetail}
        />
      }
      aboutProject={<LaunchpadAboutProjectContainer data={projectDescriptionData} isLoading={isLoadingProjectDetail} />}
      participate={
        <LaunchpadParticipateContainer
          connected={connected}
          poolInfo={currentSelectProjectPoolInfo}
          rewardInfo={projectRewardInfo}
          refetch={refetchProjectDetail}
          status={projectDetailData?.status || ""}
          isLoading={isLoadingProjectDetail}
        />
      }
      myParticipation={
        <LaunchpadMyParticipationContainer
          poolInfos={projectDetailData?.pools || []}
          status={projectDetailData?.status || ""}
          data={myParticipationData || []}
          refetch={refetchClaimAll}
          rewardInfo={projectRewardInfo}
          isLoading={isLoadingProjectDetail}
          isFetched={isFetchedProjectDetail}
        />
      }
      clickHere={<LaunchpadDetailClickHereContainer />}
      footer={<Footer />}
    />
  );
};

export default LaunchpadDetail;
