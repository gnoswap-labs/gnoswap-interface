import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";
import { toNumberFormat } from "@/common/utils/number-util";
import { TokenDefaultModel } from "@/models/token/token-default-model";

import Link from "next/link";

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

  const onClickGnoAccountInfo = () => {
    const accountAddress = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";
    accountService
      .getAccountInfoByAddress(accountAddress)
      .then(accountInfo => console.log("accountInfo", accountInfo));
  };

  return (
    <div>
      <div>
        <h1>Pages</h1>
        <h2>Home</h2>
        <ul>
          <li>
            <Link href="/">/</Link>
          </li>
        </ul>
        <h2>Token</h2>
        <ul>
          <li>
            <Link href="/tokens/token1path">/tokens/token1path</Link>
          </li>
        </ul>
        <h2>Swap</h2>
        <ul>
          <li>
            <Link href="/swap">/swap</Link>
          </li>
          <li>
            <Link href="/swap?from=token0path">/swap?from=token0path</Link>
          </li>
          <li>
            <Link href="/swap?to=token1path">/swap?to=token1path</Link>
          </li>
          <li>
            <Link href="/swap?from=token0path&to=token1path">
              /swap?from=token0path&to=token1path
            </Link>
          </li>
        </ul>
        <h2>Earn</h2>
        <ul>
          <li>
            <Link href="/earn">/earn</Link>
          </li>
          <li>
            <Link href="/earn/add">/earn/add</Link>
          </li>
        </ul>
        <h2>Earn - Pool</h2>
        <ul>
          <li>
            <Link href="/earn/pool/poolnumber1">/earn/pool/poolnumber1</Link>
          </li>
          <li>
            <Link href="/earn/pool/poolnumber1/add">
              /earn/pool/poolnumber1/add
            </Link>
          </li>
          <li>
            <Link href="/earn/pool/poolnumber1/incentivize">
              /earn/pool/poolnumber1/incentivize
            </Link>
          </li>
        </ul>
        <h2>Wallet</h2>
        <ul>
          <li>
            <Link href="/wallet">/wallet</Link>
          </li>
        </ul>
      </div>
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
        <br />
        <br />
        <br />
        <button onClick={onClickGnoAccountInfo}>Get Gno Account Test</button>
      </div>
    </div>
  );
}
