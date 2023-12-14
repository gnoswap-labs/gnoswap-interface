import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import StakePositionContainer from "@containers/stake-position-container/StakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import StakePositionLayout from "@layouts/stake-position-layout/StakePositionLayout";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "src/react-query/pools";

export default function Earn() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"];
  const { data } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB
            ? `${data?.tokenA.symbol}/${data?.tokenB.symbol} (${Number(data?.fee) / 10000
            }%)`
            : "...",
        path: `/earn/pool/${poolPath}`,
      },
      { title: "Stake Position", path: "" },
    ];
  }, [data]);

  return (
    <StakePositionLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      stakeLiquidity={<StakePositionContainer />}
      footer={<Footer />}
    />
  );
}
