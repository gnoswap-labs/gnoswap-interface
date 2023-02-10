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
	const [from, setFrom] = useState("");
	const [from2, setFrom2] = useState("");
	const [to, setTo] = useState("");
	const [to2, setTo2] = useState("");
	const [test, setTest] = useState<any>({
		tokenId: "",
		exchangeRate: "",
		usdRate: "",
	});

	const {
		accountService,
		accountRepository,
		tokenService,
		tokenRepository,
		swapService,
	} = useGnoswapContext();

	const onClickFromSwap = () => {
		tokenService.getFrom(from, from2).then(res => {
			setTest({
				...res,
				exchangeRate: res?.exchangeRate.toString(),
				usdRate: res?.usdRate.toString(),
			});
		});
	};

	const onClickToSwap = () => {
		tokenService.getFrom(to, to2).then(res => {
			setTest({
				...res,
				exchangeRate: res?.exchangeRate.toString(),
				usdRate: res?.usdRate.toString(),
			});
		});
	};

	return (
		<div style={{ padding: "3rem" }}>
			<SwapWapper>
				<label htmlFor="tokenId">From Token 아이디</label>
				<input
					id="tokenId"
					value={from}
					onChange={e => setFrom(e.target.value)}
				/>
				<label htmlFor="amount">From Token 수량</label>
				<input
					id="amount"
					value={from2}
					onChange={e => setFrom2(e.target.value)}
				/>
				<h1>{`From Exchange Rate : ${test.exchangeRate}`}</h1>
				<br />
				<h1>{`From USD Rate : ${test.usdRate}`}</h1>
				<button onClick={onClickFromSwap}>From Click</button>
			</SwapWapper>
			<SwapWapper>
				<label htmlFor="tokenId">To Token 아이디</label>
				<input id="tokenId" value={to} onChange={e => setTo(e.target.value)} />
				<label htmlFor="amount">To Token 수량</label>
				<input id="amount" value={to2} onChange={e => setTo2(e.target.value)} />
				<h1>{`To Exchange Rate : ${test.exchangeRate}`}</h1>
				<br />
				<h1>{`To USD Rate : ${test.usdRate}`}</h1>
				<button onClick={onClickToSwap}>To Click</button>
			</SwapWapper>
		</div>
	);
}

const SwapWapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 300px;
	background-color: #e4e4e4;
	padding: 10px;
	label {
		margin: 5px 0px;
	}
	input {
		border: 1px solid blue;
		padding: 5px;
		margin-bottom: 10px;
	}
	button {
		padding: 5px;
		background-color: #ababab;
		margin: 10px 0px 20px;
	}
`;
