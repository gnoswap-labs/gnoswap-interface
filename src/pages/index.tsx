import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";

export default function Home() {
	const [accountInfo, setAccountInfo] = useState<AccountInfoModel>();
	const [history, setHistory] = useState<any>();

	const { accountService, accountRepository } = useGnoswapContext();

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

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClickGetAccountButton}>아데나 회원정보 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickGetHistoryButton}>히스토리 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickCreateHistory}>히스토리 생성</button>
			{/* <h1>{JSON.stringify(accountInfo, null, 2)}</h1>
			<h1>{JSON.stringify(history, null, 2)}</h1> */}
		</div>
	);
}
