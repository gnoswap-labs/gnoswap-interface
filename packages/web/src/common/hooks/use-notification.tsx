import { TransactionModel } from "@/models/account/account-history-model";
import { AccountState } from "@/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isErrorResponse } from "../utils/validation-util";
import { StatusOptions } from "../values/data-constant";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useNotifiaction = () => {
	const { accountService } = useGnoswapContext();

	const [address] = useRecoilState(AccountState.address);
	const [notifications, setNotifications] = useRecoilState(
		AccountState.notifications,
	);
	const [tick, setTick] = useState(0);

	useEffect(() => {
		initNotifiacions();
	}, [address]);

	useEffect(() => {
		const intervalTick = setTimeout(() => setTick((tick + 1) % 100), 2000);
		updateNotifications();
		return () => clearTimeout(intervalTick);
	}, [tick]);

	const isUpdateNotifications = () => {
		if (!address || !notifications) {
			return false;
		}
		if (notifications.txs.filter(tx => tx.status === "PENDING").length === 0) {
			return false;
		}
		return true;
	};

	const initNotifiacions = () => {
		if (!address) {
			return;
		}
		accountService.getNotifications(address).then(response => {
			if (isErrorResponse(response)) {
				return;
			}
			setNotifications(response);
		});
	};

	const createNotification = (notification: TransactionModel) => {
		if (!address) {
			return;
		}
		return accountService
			.createNotification(address, notification)
			.then(initNotifiacions);
	};

	/**
	 * TODO: Need to get the transaction results from Gnoland
	 */
	const updateNotifications = async () => {
		if (!isUpdateNotifications()) {
			return;
		}
		const pendingTrnasactions =
			notifications?.txs.filter(tx => tx.status === "PENDING") ?? [];

		for (const tx of pendingTrnasactions) {
			await updateNotificationStatus(tx, "SUCCESS");
		}
		initNotifiacions();
	};

	const updateNotificationStatus = (notification: TransactionModel, status: StatusOptions) => {
		if (!address) {
			return;
		}
		const { txHash } = notification;
		return accountService.updateNotificationStatus(address, txHash, status);
	};

	const clearNotifications = () => {
		if (!address) {
			return;
		}
		return accountService.deleteAllNotification(address).then(initNotifiacions);
	};

	return {
		notifications,
		createNotification,
		updateNotificationStatus,
		clearNotifications,
	};
};
