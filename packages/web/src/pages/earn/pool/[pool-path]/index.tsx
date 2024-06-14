import React, { useEffect, useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "@query/pools";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { addressValidationCheck } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { PoolModel } from "@models/pool/pool-model";
import { encryptId } from "@utils/common";

export const getServerSideProps: GetServerSideProps<{ pool?: PoolModel }> = (async () => {
  // export const getServerSideProps: GetServerSideProps<{ pool?: PoolModel }> = (async (context) => {
  // const poolPath = (context.query["pool-path"] || "") as string;

  // const res = await fetch(API_URL + "/pools/" + encodeURIComponent(encryptId(poolPath)));

  // if (HTTP_5XX_ERROR.includes(res.status)) {
  //   return {
  //     redirect: {
  //       destination: "/500",
  //       permanent: false
  //     }
  //   };
  // }

  // if (res.status === 404) {
  //   return { notFound: true };
  // }

  // if (res.status === 200) {
  //   const poolRes = (await res.json()).data as PoolResponse;

  //   return {
  //     props: {
  //       pool: PoolMapper.fromResponse(poolRes)
  //     }
  //   };
  // }

  return { props: {} };
});

export default function Pool({ pool }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { account } = useWallet();
  const poolPath = (router.query["pool-path"] || "") as string;
  const { data = pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
    initialData: pool,
    onError: (err: any) => {
      if (err["response"]["status"] === 404) {
        router.push("/404");
      }
    }
  });

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);


  const {
    isFetchedPosition,
    loading,
    positions,
  } = usePositionData({
    address,
    poolPath: encryptId(poolPath),
    queryOption: {
      enabled: !!poolPath,
    }
  });

  const isStaking = useMemo(() => {
    if (data?.incentiveType === "INCENTIVIZED") {
      return true;
    }
    const stakedPositions = positions.filter(position => position.staked);
    if (stakedPositions.length > 0) {
      return true;
    }
    if (data?.incentiveType === "EXTERNAL") {
      return true;
    }
    return false;
  }, [data?.incentiveType, positions]);

  useEffect(() => {
    if (
      hash === "staking"
      && !loading
      && isFetchedPosition
      && isStaking
    ) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
      return;
    }

    if (
      address &&
      isFetchedPosition &&
      !loading &&
      poolPath
    ) {
      if (hash && hash !== "staking") {
        setTimeout(() => {
          const positionContainerElement = document.getElementById(`${hash}`);
          const topPosition =
            positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        });
        return;
      }

      setTimeout(() => {
        const positionContainerElement =
          document.getElementById("liquidity-wrapper");
        const topPosition =
          positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
    }
  }, [
    isFetchedPosition,
    hash,
    address,
    loading,
    positions.length,
    isStaking,
    poolPath,
  ]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer address={address} />}
      staking={isStaking ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStaking}
    />
  );
}
