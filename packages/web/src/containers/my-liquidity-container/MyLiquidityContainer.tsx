import React, { useCallback } from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";

export const liquidityInit = {
  poolInfo: {
    tokenPair: {
      tokenA: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        compositionPercent: "50",
        composition: "50.05881",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      tokenB: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        compositionPercent: "50",
        composition: "150.0255",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    token0Rate: "50%",
    token1Rate: "50%",
    feeRate: FEE_RATE_OPTION.FEE_3,
  },
  totalBalance: "$1.24m",
  swapFees: "150",
  dailyEarn: "$954.52",
  claimRewards: "$3,052.59",
  positionList: [
    {
      productId: 982932,
      tokenPair: {
        tokenA: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "HEX",
          symbol: "HEX",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        tokenB: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "USDCoin",
          symbol: "USDC",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
        isStaked: true,
        range: true,
        balance: "18,092.45",
        totalRewards: "1,015.24",
        estimatedAPR: "90.5",
        minAmount: "1,105.1",
        maxAmount: "1,268.2",
      },
    },
    {
      productId: 982933,
      tokenPair: {
        tokenA: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "HEX",
          symbol: "HEX",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        tokenB: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "USDCoin",
          symbol: "USDC",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
        isStaked: true,
        range: true,
        balance: "18,092.45",
        totalRewards: "1,015.24",
        estimatedAPR: "100.5",
        minAmount: "1,105.1",
        maxAmount: "1,268.2",
      },
    },
    {
      productId: 982934,
      tokenPair: {
        tokenA: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "HEX",
          symbol: "HEX",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        tokenB: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "USDCoin",
          symbol: "USDC",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
        isStaked: false,
        range: false,
        balance: "18,092.45",
        totalRewards: "1,015.24",
        estimatedAPR: "90.5",
        minAmount: "1,105.1",
        maxAmount: "1,268.2",
      },
    },
  ],
};

const MyLiquidityContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();
  const router = useRouter();
  
  const handleClickAddPosition = useCallback(() => {
    router.push(`${router.asPath}/add?tokenA=gno.land/r/foo&tokenB=gno.land/r/bar&direction=EXACT_IN`);
  }, [router]);


  return (
    <MyLiquidity
      info={liquidityInit}
      breakpoint={breakpoint}
      connected={connectedWallet}
      isSwitchNetwork={isSwitchNetwork}
      handleClickAddPosition={handleClickAddPosition}
    />
  );
};

export default MyLiquidityContainer;
