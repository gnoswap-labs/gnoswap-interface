import { faker } from "@faker-js/faker";

export const generateAddress = () => {
	return `g${generateRandomString(39)}`;
};

export const generateToken0 = () => {
	return {
		denom: "GNOT",
		value: generateNumberPlus(),
	};
};

export const generateToken1 = () => {
	return {
		denom: "GNOS",
		value: generateNumberPlus(),
	};
};

export const generateNumber = (minNumber: number, maxNumber: number) => {
	return Math.random() * (maxNumber - minNumber) + minNumber;
};

export const generateTime = () => {
	const times = faker.date.betweens(
		"2020-01-01T00:00:00.000Z",
		"2030-01-01T00:00:00.000Z",
		1,
	);
	return times[0];
};

export const generateTxHash = () => {
	return `${generateNumber(1, 10000)}_0`;
};

const generateNumberPlus = () => {
	return generateNumber(1, 10000);
};

const generateNumberMinus = () => {
	return generateNumber(-10000, 0);
};

const generateRandomString = (length: number) => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};
