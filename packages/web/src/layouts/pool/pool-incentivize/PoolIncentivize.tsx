import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { DEVICE_TYPE } from "@styles/media";
import { useGetTokens } from "@query/token";
import { checkGnotPath } from "@utils/common";
import { makeRouteUrl } from "@utils/page.utils";

import PoolAddIncentivizeContainer from "./containers/pool-add-incentivize-container/PoolAddIncentivizeContainer";
import PoolIncentivizeContainer from "./containers/pool-incentivize-container/PoolIncentivizeContainer";
import PoolIncentivizeLayout from "./PoolIncentivizeLayout";
import IncentivizePoolHistoryContainer from "./containers/incentivize-pool-history-container/IncentivizePoolHistoryContainer";

const PoolIncentivize: React.FC = () => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath() || "::";
  const [tokenAPath, tokenBPath, fee] = poolPath.split(":");
  const { getGnotPath } = useGnotToGnot();
  const { data: { tokens = [] } = {} } = useGetTokens(true);

  const { isLoading } = useLoading();

  const hasDedicatedPool = router.asPath.includes("/pool");

  const listBreadcrumb = useMemo(() => {
    const base = [{ title: t("business:pageHeader.earn"), path: "/earn" }];

    if (hasDedicatedPool) {
      const tokenA = getGnotPath(tokenAPath ? tokens.find(item => item.path === checkGnotPath(tokenAPath)) : undefined);
      const tokenB = getGnotPath(tokenBPath ? tokens.find(item => item.path === checkGnotPath(tokenBPath)) : undefined);
      base.push({
        title:
          breakpoint === DEVICE_TYPE.WEB || breakpoint === DEVICE_TYPE.MEDIUM_WEB
            ? `${getGnotPath(tokenA).displaySymbol}/${getGnotPath(tokenB).displaySymbol} (${Number(fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      });
    }

    base.push({ title: t("business:pageHeader.incentivzePool"), path: "" });

    return base;
  }, [breakpoint, fee, getGnotPath, hasDedicatedPool, poolPath, t, tokenAPath, tokenBPath, tokens]);

  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} isLoading={isLoading} />}
      poolIncentivize={hasDedicatedPool ? <PoolAddIncentivizeContainer /> : <PoolIncentivizeContainer />}
      history={<IncentivizePoolHistoryContainer />}
      footer={<Footer />}
    />
  );
};

export default PoolIncentivize;
