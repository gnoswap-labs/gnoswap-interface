import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import StakingContainer from "@containers/staking-container/StakingContainer";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import { useGetPoolDetailByPath } from "@query/pools";
import { addressValidationCheck } from "@utils/validation-utils";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Pool() {
  const router = useRouter();
  const { account } = useWallet();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const isStaking = useMemo(() => {
    if (data?.incentivizedType === "INCENTIVIZED") {
      return true;
    }
    if (data?.incentivizedType === "EXTERNAL_INCENTIVIZED") {
      return true;
    }
    return false;
  }, [data?.incentivizedType]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer address={address}/>}
      liquidity={<MyLiquidityContainer address={address} />}
      staking={isStaking ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStaking}
    />
  );
}
