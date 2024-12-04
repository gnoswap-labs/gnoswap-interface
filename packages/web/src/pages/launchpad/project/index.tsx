import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import SEOHeader from "@components/common/seo-header/seo-header";
import { LaunchpadProjectDetailsModel } from "@models/launchpad";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { LaunchpadState } from "@states/index";
import { useGetLaunchpadProjectDetails } from "@query/launchpad/use-get-launchpad-project-details";
import { BreadcrumbTypes } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import { useGetLaunchpadParticipationInfos } from "@query/launchpad/use-get-launchpad-participation-infos";

import LaunchpadDetailLayout from "@views/launchpad/launchpad-detail/LaunchpadDetailLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import LaunchpadDetailContentsHeaderContainer from "@views/launchpad/launchpad-detail/containers/launchpad-detail-contents-header-container/LaunchpadDetailContentsHeaderContainer";
import LaunchpadPoolListContainer from "@views/launchpad/launchpad-detail/containers/launchpad-pool-list-container/LaunchpadPoolListContainer";
import LaunchpadProjectSummaryContainer from "@views/launchpad/launchpad-detail/containers/launchpad-project-summary-container/LaunchpadProjectSummaryContainer";
import LaunchpadAboutProjectContainer from "@views/launchpad/launchpad-detail/containers/launchpad-about-project-container/LaunchpadAboutProjectContainer";
import LaunchpadParticipateContainer from "@views/launchpad/launchpad-detail/containers/launchpad-participate-container/LaunchpadParticipateContainer";
import LaunchpadDetailClickHereContainer from "@views/launchpad/launchpad-detail/containers/launchpad-detail-click-here-container/LaunchpadDetailClickHereContainer";
import Footer from "@components/common/footer/Footer";
import LaunchpadMyParticipationContainer from "@views/launchpad/launchpad-detail/containers/launchpad-my-participation-container/LaunchpadMyParticipationContainer";

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
  rewardTokenLogoUrl: string;
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad"])),
    },
  };
}

export default function Page() {
  const { t } = useTranslation();

  const [selectPoolId, setSelectPoolId] = useAtom(LaunchpadState.selectLaunchpadPool);
  const [, setDepositConditions] = useAtom(LaunchpadState.depositConditions);
  const { updateBalances } = useTokenData();

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
        path: "/launchpad",
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
      rewardTokenLogoUrl: "",
    };

    if (!projectDetailData) return initProjectRewardInfo;

    return {
      rewardTokenPath: projectDetailData.rewardTokenPath ?? initProjectRewardInfo.rewardTokenPath,
      rewardTokenDecimals: projectDetailData.rewardTokenDecimals ?? initProjectRewardInfo.rewardTokenDecimals,
      rewardTokenSymbol: projectDetailData.rewardTokenSymbol ?? initProjectRewardInfo.rewardTokenSymbol,
      rewardTokenLogoUrl: projectDetailData.rewardTokenLogoUrl ?? initProjectRewardInfo.rewardTokenLogoUrl,
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
    await updateBalances();
  };
  const refetchClaimAll = async () => {
    await projectDetailRefetch();
    await myParticipationRefetch();
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

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = React.useMemo(() => SEOInfo["/launchpad"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
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
            data={projectSummaryData}
            isLoading={isLoadingProjectDetail}
          />
        }
        aboutProject={
          <LaunchpadAboutProjectContainer data={projectDescriptionData} isLoading={isLoadingProjectDetail} />
        }
        participate={
          <LaunchpadParticipateContainer
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
    </>
  );
}
