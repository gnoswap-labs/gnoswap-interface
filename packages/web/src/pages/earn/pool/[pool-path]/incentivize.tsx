import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolAddIncentivizeContainer from "@containers/pool-add-incentivize-container/PoolAddIncentivizeContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
// import { getServerSideProps } from "./index";

// export { getServerSideProps };

export default function PoolIncentivize() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.query["pool-path"];

  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB ||
            breakpoint === DEVICE_TYPE.MEDIUM_WEB
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} (${Number(data?.fee) / 10000
            }%)`
            : "...",
        path: `/earn/pool/${router.query["pool-path"]}`,
      },
      { title: "Incentivize Pool", path: "" },
    ];
  }, [data, breakpoint]);

  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={listBreadcrumb}
          isLoading={isLoadingCommon || isLoading}
        />
      }
      poolIncentivize={<PoolAddIncentivizeContainer />}
      footer={<Footer />}
    />
  );
}
