import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";

export default function Home() {
	const [accountInfo, setAccountInfo] = useState<AccountInfoModel>();

	const { accountService } = useGnoswapContext();

	const text = JSON.stringify(accountInfo, null, 2);

	const onClickGetAccountButton = () => {
		accountService.getAccountInfo().then(setAccountInfo);
	};

	return (
		<>
			<h1>text</h1>
			<button onClick={onClickGetAccountButton}>아데나 회원정보 조회</button>
			<h1>{text}</h1>
		</>
	);
}
