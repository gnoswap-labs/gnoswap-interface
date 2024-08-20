import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DeviceSize } from "@styles/media";
import { useGetPoolDetailByPath } from "src/react-query/pools";

import PoolRemoveLayout from "./PoolRemoveLayout";
import RemoveLiquidityContainer from "./containers/remove-liquidity-container/RemoveLiquidityContainer";

const PoolRemove: React.FC = () => {
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
        path: `/earn/pool?poolPath=${poolPath}`,
      },
      { title: t("business:pageHeader.removePosi"), path: "" },
    ];
  }, [data, width, t, poolPath]);

  return (
    <PoolRemoveLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={listBreadcrumb}
          isLoading={isLoadingCommon || isLoading}
        />
      }
      removeLiquidity={<RemoveLiquidityContainer />}
      footer={<Footer />}
    />
  );
};

export default PoolRemove;
