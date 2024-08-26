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
import PoolAddLiquidityContainer from "./containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import AdditionalInfoContainer from "./containers/additional-info-container/AdditionalInfoContainer";
import PoolAddLayout from "./PoolAddLayout";

interface PoolAddProps {
  useDedicatedPool: boolean;
}

const PoolAdd: React.FC<PoolAddProps> = ({useDedicatedPool}) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const { data, isLoading } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    const base = [{ title: t("business:pageHeader.earn"), path: "/earn" }];

    if (useDedicatedPool) {
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
    useDedicatedPool,
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
          isLoading={useDedicatedPool ? isLoadingCommon || isLoading : false}
        />
      }
      addLiquidity={
        useDedicatedPool ? (
          <PoolAddLiquidityContainer />
        ) : (
          <EarnAddLiquidityContainer />
        )
      }
      additionalInfo={<AdditionalInfoContainer />}
      footer={<Footer />}
    />
  );
};

export default PoolAdd;