import { AccountState } from "@/states";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useWallet = () => {
	const { accountService } = useGnoswapContext();

	const [connected, setConnected] = useRecoilState(AccountState.connected);
	const [address, setAddress] = useRecoilState(AccountState.address);
	const [error, setError] = useState(null);

	const connectWallet = () => {
		connectToEstablishedSite().then(connectToGetAccountInfo).catch(setError);
	};

	const connectToEstablishedSite = () => {
		return accountService
			.connectAdenaWallet()
			.then(response => setConnected(response === true));
	};

	const connectToGetAccountInfo = () => {
		return accountService
			.getAccountInfo()
			.then(response => setAddress(response?.address ?? ""));
	};

	const disconnectWallet = () => {
		setAddress(null);
		setConnected(false);
	};

	return {
		address,
		connected,
		connectWallet,
		disconnectWallet,
		error,
	};
};
