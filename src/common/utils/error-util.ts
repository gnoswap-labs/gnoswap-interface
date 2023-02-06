export const returnNullWithLog = (error?: Error) => {
	if (error) {
		console.log(error);
	}
	return null;
};

export const returnNullWithNotification = (error?: Error) => {
	if (error) {
		// TODO: Add notification hook
		console.log(error);
	}
	return null;
};
