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

	const onClick = () => {
		tokenService
			.getTokenDatatable()
			.then(res => console.log("token Table ", res));
		// swapService.getSwapRate().then((res) => console.log('Swap :: ', res))
	};

	return (
		<div style={{ padding: "3rem" }}>
			<button onClick={onClick}>Test</button>
		</div>
	);
}
