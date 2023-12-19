import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolAddIncentivizeContainer from "@containers/pool-add-incentivize-container/PoolAddIncentivizeContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { encriptId } from "@utils/common";

export default function PoolIncentivize() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"];
  
  const path = useMemo(() => {
    if (!poolPath) return "";
    return encriptId(poolPath as string);
  }, [poolPath]);
  
  const { data } = useGetPoolDetailByPath(encriptId(path) as string, { enabled: !!path });
  
  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB
            ? `${data?.tokenA.symbol}/${data?.tokenB.symbol} (${Number(data?.fee) / 10000
            }%)`
            : "...",
        path: `/earn/pool/${router.query["pool-path"]}`,
      },
      { title: "Incentivize Pool", path: "" },
    ];
  }, [data]);

  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      poolIncentivize={<PoolAddIncentivizeContainer />}
      footer={<Footer />}
    />
  );
}