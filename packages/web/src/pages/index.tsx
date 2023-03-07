import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";
import { toNumberFormat } from "@/common/utils/number-util";
import { TokenDefaultModel } from "@/models/token/token-default-model";

export default function Home() {
  const {
    accountService,
    accountRepository,
    tokenService,
    tokenRepository,
    swapService,
  } = useGnoswapContext();

  const onClick = () => {
    tokenService
      .getTokenDatatable()
      .then(res => console.log("token Table ", res));
  };

  const onClickToken = () => {
    tokenService.getTokenById("2").then(res => console.log("token Id ", res));
  };

  const onClickSwap = () => {
    const token0: TokenDefaultModel = {
      tokenId: "1",
      name: "Gnoswap",
      symbol: "GNOSWAP",
      amount: {
        value: BigNumber(2000),
        denom: "gnosh",
      },
    };
    const token1: TokenDefaultModel = {
      tokenId: "2",
      name: "Gnoland",
      symbol: "GNO.LAND",
      amount: {
        value: BigNumber(1000),
        denom: "ugnot",
      },
    };
    const type = "EXACT_IN";
    swapService
      .getSwapRate(token0, token1, type)
      .then(res => console.log("Swap : ", res));
  };

  return (
    <>
      <h1>Red Test</h1>
      <div style={{ padding: "3rem" }}>
        <button onClick={onClick}>Token Table Test</button>
        <br />
        <br />
        <br />
        <button onClick={onClickToken}>Token ID</button>
        <br />
        <br />
        <br />
        <button onClick={onClickSwap}>Swap Test</button>
      </div>
    </>
  );
}
