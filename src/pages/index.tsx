import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";

export default function Home() {
	const [accountInfo, setAccountInfo] = useState<AccountInfoModel>();
	const [history, setHistory] = useState<any>();

	const { accountService, accountRepository } = useGnoswapContext();

	const onClickGetAccountButton = () => {
		accountService.getAccountInfo().then(res => console.log("account : ", res));
	};

	const onClickGetHistoryButton = () => {
		accountService
			.getNotifications("123")
			.then(res => console.log("history : ", res));
	};

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClickGetAccountButton}>아데나 회원정보 조회</button>
			<br /> <br /> <br />
			<button onClick={onClickGetHistoryButton}>히스토리 조회</button>
			<br /> <br /> <br />
		</div>
	);
}
