import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import { PoolModel } from "@/models/pool/pool-model";
import React, { useContext, useEffect, useState } from "react";

export default function Pool() {
	const [result1, setResult1] = useState<PoolModel>();
	const [result2, setResult2] = useState<any>([]);
	const [result3, setResult3] = useState<any>([]);
	const [result4, setResult4] = useState<any>([]);
	const [result5, setResult5] = useState<any>([]);

	const { poolService, liquidityService } = useGnoswapContext();

	const renderResult1OfGetPoolById = () => {
		const title = "getPoolById";
		const result = result1;
		const setResult = setResult1;
		return (
			<div>
				<h1>{title}</h1>
				<div>
					<button onClick={() => setResult(undefined)}>초기화</button>
				</div>
				<div>
					<button
						onClick={() =>
							poolService
								.getPoolById("asdf")
								.then(r => r !== null && setResult(r))
						}
					>
						조회
					</button>
				</div>
				<h1>{JSON.stringify(result, null, 2)}</h1>
				<hr />
			</div>
		);
	};

	const renderResult2OfGetPools = () => {
		const title = "getPools";
		const result = result2;
		const setResult = setResult2;
		return (
			<div>
				<h1>{title}</h1>
				<div>
					<button onClick={() => setResult([])}>초기화</button>
				</div>
				<div>
					<button onClick={() => poolService.getPools().then(setResult)}>
						조회
					</button>
				</div>
				<h1>{JSON.stringify(result, null, 2)}</h1>
				<hr />
			</div>
		);
	};

	const renderResult3OfGetLiquiditiesByAddress = () => {
		const title = "getLiquiditiesByAddress";
		const result = result3;
		const setResult = setResult3;
		return (
			<div>
				<h1>{title}</h1>
				<div>
					<button onClick={() => setResult([])}>초기화</button>
				</div>
				<div>
					<button
						onClick={() =>
							liquidityService.getLiquiditiesByAddress("asdf").then(setResult)
						}
					>
						조회
					</button>
				</div>
				<h1>{JSON.stringify(result, null, 2)}</h1>
				<hr />
			</div>
		);
	};

	return (
		<div style={{ whiteSpace: "pre-wrap" }}>
			{renderResult1OfGetPoolById()}
			{renderResult2OfGetPools()}
			{renderResult3OfGetLiquiditiesByAddress()}
		</div>
	);
}
