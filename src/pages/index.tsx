import { useGnoswapContext } from "@/common/hooks/use-gnoswap-context";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

export default function Home() {
	const [text, setText] = useState("");

	const contexts = useGnoswapContext();

	useEffect(() => {
		init();
		console.log(contexts);
	}, [contexts]);

	const init = async () => {
		const result = (await contexts?.accountRepository.getAccount()) ?? "";
		setText(`${JSON.stringify(result)}`);
	};

	return (
		<>
			<h1>text</h1>
			<h1>{text}</h1>
		</>
	);
}
