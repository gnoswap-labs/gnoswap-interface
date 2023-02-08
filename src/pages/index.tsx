import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";
import { TokenService } from "@/services/token/token-service";

export default function Home() {
	const [accountInfo, setAccountInfo] = useState<AccountInfoModel>();
	const [history, setHistory] = useState<any>();

	const { accountService, accountRepository, tokenService, tokenRepository } =
		useGnoswapContext();

	const onClickGetAccountButton = () => {
		accountService.getAccountInfo().then(res => console.log("account : ", res));
	};

	const onClickGetHistoryButton = () => {
		accountRepository
			.getNotificationsByAddress("address")
			.then(res => console.log("connectAdenaWallet : ", res));
		// accountRepository
		// 	.getTransactions("123")
		// 	.then(res => console.log("history : ", res));
	};

	const onClickCreateHistory = () => {
		accountRepository
			.createNotification("address", {
				txHash: generateId(),
				status: "SUCCESS",
				tokenInfo: {
					amount: {
						value: BigNumber(0),
						denom: "ugnot",
					},
					tokenId: "1",
					name: "sfsfs",
					symbol: "asdfasdf",
				},
				txType: 0,
				createdAt: "",
			})
			.then(res => console.log("connectAdenaWallet : ", res));
		// accountRepository
		// 	.getTransactions("123")
		// 	.then(res => console.log("history : ", res));
	};

	const onClickTokenDatatable = () => {
		// tokenService
		// 	.getTokenDatatable()
		// 	.then(res => console.log("Token Datatable : ", res));
		// tokenRepository
		// 	.getSummaryPopularTokens()
		// 	.then(res => console.log("tegst : ", res));
		tokenService
			.getTokenDatatable("GRC20")
			.then(res => console.log("tegst : ", res));
	};

	const onClickPopularTokens = () => {
		tokenService
			.getPopularTokens()
			.then(res => console.log("Popular Tokens : ", res));
	};

	const onClickHighestTokens = () => {
		tokenService
			.getHighestRewardTokens()
			.then(res => console.log("Highest Tokens : ", res));
	};

	const onClickRecentlyTokens = () => {
		tokenService
			.getRecentlyAddedTokens()
			.then(res => console.log("Recently Tokens : ", res));
	};

	const onClickSearchToken = () => {
		tokenService.getSearchTokens({ keyword: "asd", type: "asd" });
	};

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClickGetAccountButton}>아데나 회원정보 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickGetHistoryButton}>히스토리 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickCreateHistory}>히스토리 생성</button>
			<br /> <br /> <br />
			<button onClick={onClickTokenDatatable}>토큰 데이터테이블 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickPopularTokens}>Popular Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickHighestTokens}>Highest Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickRecentlyTokens}>Recently Tokens 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickSearchToken}>토큰 검색</button>
			{/* <h1>{JSON.stringify(accountInfo, null, 2)}</h1>
			<h1>{JSON.stringify(history, null, 2)}</h1> */}
		</div>
	);
}
