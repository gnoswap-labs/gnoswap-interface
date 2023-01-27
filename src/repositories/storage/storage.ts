import { StorageKeyType } from "@/common/values";

export const getItem = (key: StorageKeyType) => {
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
