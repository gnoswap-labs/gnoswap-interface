import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountInfoModel } from "@/models/account/account-info-model";
import React, { useContext, useEffect, useState } from "react";
import { AccountHistoryModel } from "@/models/account/account-history-model";
import BigNumber from "bignumber.js";
import { generateId } from "@/common/utils/test-util";
import styled from "styled-components";
import { toNumberFormat } from "@/common/utils/number-util";

export default function Home() {
	const {
		accountService,
		accountRepository,
		tokenService,
		tokenRepository,
		swapService,
	} = useGnoswapContext();

	const [token0Value, setToken0Value] = useState("");
	const [token1Value, setToken1Value] = useState("");
	const [token0, setToken0] = useState<any>({
		tokenId: "",
		name: "",
		symbol: "",
		amount: { value: BigNumber(0), denum: "" },
	});
	const [token1, setToken1] = useState<any>({
		tokenId: "",
		name: "",
		symbol: "",
		amount: { value: BigNumber(0), denum: "" },
	});

	const onClickTokenMetas = () => {
		tokenService
			.getAllTokenMetas()
			.then(res => console.log("Token Metas 조회 :: ", res));
	};

	const onClickTokenId = async () => {
		await tokenService.getTokenById(token0Value).then(res => setToken0(res));
		await tokenService.getTokenById(token1Value).then(res => setToken1(res));
	};

	const onClickSwapRate = async () => {
		if (token0 && token1) {
			// const type = "EXACT_IN";
			// swapService
			// 	.getSwapRate({
			// 		token0,
			// 		token1,
			// 		type,
			// 	})
			// 	.then(res => console.log("Swap Rate :: ", res.toString()));
		}
	};

	const onClickSwapExpected = () => {
		if (token0 && token1) {
			const type = "EXACT_IN";
			swapService
				.getExpectedSwapResult(token0, token1, type)
				.then(res => console.log("Swap Expected :: ", res));
		}
	};

	const onClickSwap = () => {
		accountService
			.connectAdenaWallet()
			.then(res => console.log("account test ", res));
		// swapService.getSwapRate().then((res) => console.log('Swap :: ', res))
	};

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClickTokenMetas}>Token Metas 조회</button>
			<br />
			<br />
			<br />
			<input
				style={{ border: "1px solid blue", padding: "5px", margin: "5px" }}
				value={token0Value}
				onChange={e => setToken0Value(e.target.value)}
			/>
			<br />
			<input
				style={{ border: "1px solid blue", padding: "5px", margin: "5px" }}
				value={token1Value}
				onChange={e => setToken1Value(e.target.value)}
			/>
			<br />
			<br />
			<br />
			<button onClick={onClickTokenId}>Token ID 조회</button>
			<br />
			<br />
			<br />
			<button onClick={onClickSwapRate}>Swap 비율 조회</button>
			<br />
			<br />
			<br />
			<button onClick={onClickSwapExpected}>Swap 예상 결과 조회</button>
			<br />
			<br />
			<br />
			<button onClick={onClickSwap}>Account TEst</button>
		</div>
	);
}
