import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetPoolDetailByPath } from "@query/pools";
import { DeviceSize } from "@styles/media";
import { makeRouteUrl } from "@utils/page.utils";

import EarnAddLiquidityContainer from "./containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import ExchangeRateGraphContainer from "./containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import PoolAddLiquidityContainer from "./containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import QuickPoolInfoContainer from "./containers/quick-pool-info-container/QuickPoolInfoContainer";
import PoolAddLayout from "./PoolAddLayout";

const PoolAdd: React.FC = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const { data, isLoading } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const hasDedicatedPool = router.asPath.includes("/pool");

  const listBreadcrumb = useMemo(() => {
    const base = [{ title: t("business:pageHeader.earn"), path: "/earn" }];

    if (hasDedicatedPool) {
      base.push({
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: data?.poolPath,
        }),
      });
    }

    base.push({ title: t("business:pageHeader.addPosi"), path: "" });

    return base;
  }, [
    t,
    hasDedicatedPool,
    width,
    getGnotPath,
    data?.tokenA,
    data?.tokenB,
    data?.fee,
    data?.poolPath,
  ]);

  return (
    <PoolAddLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={listBreadcrumb}
          isLoading={hasDedicatedPool ? isLoadingCommon || isLoading : false}
        />
      }
      addLiquidity={
        hasDedicatedPool ? (
          <PoolAddLiquidityContainer />
        ) : (
          <EarnAddLiquidityContainer />
        )
      }
      quickPoolInfo={<QuickPoolInfoContainer />}
      exchangeRateGraph={<ExchangeRateGraphContainer />}
      footer={<Footer />}
    />
  );
};

export default PoolAdd;