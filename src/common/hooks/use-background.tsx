import { TokenState } from "@/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useExchange } from "./use-exchange";
import { useTokenResource } from "./use-token-resource";

export const useBackground = () => {
	const { updateTokenMetas } = useTokenResource();
	const { updateExchangeRates, updateUSDRate } = useExchange();

	const [standard, setStandard] = useRecoilState(TokenState.standard);

	const [tick, setTick] = useState(0);

	useEffect(() => {
		initStandardToken();
		updateTokenMetas();
	}, []);

	useEffect(() => {
		if (!standard) {
			return;
		}
		// const intervalTick = setTimeout(() => setTick((tick + 1) % 100), 5 * 1000);

		console.log("BACKGROUND FETCH");
		updateExchangeRates();
		updateUSDRate();

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

	return;
};
