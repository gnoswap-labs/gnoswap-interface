import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { PoolModel } from "@/models/pool/pool-model";
import React, { useContext, useEffect, useState } from "react";

export default function Pool() {
	const [pools, setPools] = useState<Array<PoolModel>>([]);

	const { poolService } = useGnoswapContext();

	const text = JSON.stringify(pools, null, 2);

	const onClickButton = () => {
		poolService.getPools().then(setPools);
		// accountService.getAccountInfo().then(setAccountInfo);
	};

	return (
		<>
			<h1>text</h1>
			<button onClick={onClickButton}>아데나 풀 목록 조회</button>
			<h1>{text}</h1>
		</>
	);
}
