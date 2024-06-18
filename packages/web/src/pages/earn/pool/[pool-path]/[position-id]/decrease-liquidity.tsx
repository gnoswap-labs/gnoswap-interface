import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import DecreaseLiquidityContainer from "@containers/decrease-liquidity-container/DecreaseLiquidityContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import IncreaseLiquidityLayout from "@layouts/increase-liquidity-layout/IncreaseLiquidityLayout";
import { DeviceSize } from "@styles/media";
import useRouter from "@hooks/common/use-custom-router";
import { useMemo } from "react";
import { useGetPoolDetailByPath } from "src/react-query/pools";
// import { getServerSideProps } from "../index";

// export { getServerSideProps };

export default function DecreaseLiquidity() {
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"] || "";
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol
            } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: `/earn/pool/${router.query["pool-path"]}`,
      },
      { title: "Decrease Liquidity", path: "" },
    ];
  }, [data, width]);

  return (
    <IncreaseLiquidityLayout
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
}
