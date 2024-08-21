import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DeviceSize } from "@styles/media";
import { makeRouteUrl } from "@utils/page.utils";
import { useGetPoolDetailByPath } from "src/react-query/pools";

import DecreaseLiquidityContainer from "./containers/decrease-liquidity-container/DecreaseLiquidityContainer";
import ModifyLiquidityLayout from "../common/layouts/modify-liquidity-layout/ModifyLiquidityLayout";

const PoolDecreaseLiquidity: React.FC = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string);
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: t("business:pageHeader.earn"), path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      },
      { title: t("business:pageHeader.decreaseLiqui"), path: "" },
    ];
  }, [data, width, t, poolPath]);

  return (
    <ModifyLiquidityLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={listBreadcrumb}
          isLoading={isLoadingCommon || isLoading}
        />
      }
      increaseLiquidity={<DecreaseLiquidityContainer />}
      footer={<Footer />}
    />
  );
};

export default PoolDecreaseLiquidity;
