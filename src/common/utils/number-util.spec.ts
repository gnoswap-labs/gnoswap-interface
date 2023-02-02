import BigNumber from "bignumber.js";
import { toNumberFormat } from "./number-util";

describe("bignumber.js convert to format string", () => {
	test("123123123.123123123 to 123,123,123.123123123", async () => {
		const bigNumber = BigNumber("123123123.123123123");

		expect(toNumberFormat(bigNumber)).toBe("123,123,123.123123123");
	});

	test("decimal places is 3, 123123123.123123123 to 123,123,123.123", async () => {
		const bigNumber = BigNumber("123123123.123123123");

		expect(toNumberFormat(bigNumber, 3)).toBe("123,123,123.123");
	});
});

export {};
