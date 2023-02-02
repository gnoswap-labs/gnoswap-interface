import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

export default function Home() {
	const [text, setText] = useState("");

	const { accountService } = useGnoswapContext();

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		const result = (await accountService.getAccountInfo()) ?? "";
		setText(`${JSON.stringify(result)}`);
	};

	return (
		<>
			<h1>text</h1>
			<h1>{text}</h1>
		</>
	);
}
