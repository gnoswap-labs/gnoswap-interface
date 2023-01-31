import { StorageKeyType } from "@/common/values";
import { GnoClient } from "gno-client";

export const getItem = (key: StorageKeyType) => {
	const gnoClient = GnoClient.createNetworkByType(
		{ chainId: "sdf", chainName: "sdf", rpcUrl: "sdf" },
		"TEST3",
	);
	console.log(gnoClient);
	return localStorage.getItem(key);
};

export const setItem = (key: StorageKeyType, value: any) => {
	return localStorage.setItem(key, `${value}`);
};

export const removeItem = (key: StorageKeyType) => {
	return localStorage.removeItem(key);
};

export const exists = (key: StorageKeyType) => {
	const value = getItem(key);
	if (!value) {
		return false;
	}
	return true;
};
