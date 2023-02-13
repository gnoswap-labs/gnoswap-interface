import { TransactionModel } from "@/models/account/account-history-model";
import { TokenMeta } from "@/repositories/token";
import { AccountState, TokenState } from "@/states";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useBackground = () => {
	const { tokenService, tokenRepository } = useGnoswapContext();

	const [standard, setStandard] = useRecoilState(TokenState.standard);
	const [, setTokenMetas] = useRecoilState(TokenState.tokenMetas);
	const [, setExchangeRates] = useRecoilState(TokenState.exchangeRates);
	const [, setUSDRate] = useRecoilState(TokenState.usdRate);

	const [tick, setTick] = useState(0);

	useEffect(() => {
		initStandardToken();
		initTokenMetas();
	}, []);

	useEffect(() => {
		if (!standard) {
			return;
		}
		// const intervalTick = setTimeout(() => setTick((tick + 1) % 100), 5 * 1000);

		console.log("BACKGROUND FETCH");
		initExchangeRates(standard);
		initUSDRate(standard);

		// return () => clearTimeout(intervalTick);
	}, [standard]);

	const initStandardToken = () => {
		setStandard({
			token_id: "1",
			name: "GNO.LAND",
			symbol: "GNOLAND",
			decimals: 6,
			denom: "GNOT",
			minimal_denom: "ugnot",
		});
	};

	const initTokenMetas = () => {
		tokenRepository
			.getAllTokenMetas()
			.then(resposne => setTokenMetas(resposne.tokens));
	};

	const initExchangeRates = (token: TokenMeta) => {
		tokenService
			.getAllExchangeRates(token.token_id)
			.then(response => response && setExchangeRates(response.rates));
	};

	const initUSDRate = (token: TokenMeta) => {
		tokenService
			.getUSDExchangeRate(token.token_id)
			.then(response => response && setUSDRate(BigNumber(response.rate)));
	};

	return;
};
