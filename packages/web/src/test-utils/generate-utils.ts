import { faker } from "@faker-js/faker";
import BigNumber from "bignumber.js";

export const generateBarAreaDatas = () => {
  return Array.from(
    { length: 40 },
    (_, index) =>
      `${
        100 - Math.trunc(Math.abs(20 - index) / 3) * (Math.random() * 10 + 10)
      }`,
  );
};

export const generateAddress = () => {
  return `g1${generateRandomString(38)}`;
};

export const generateId = () => {
  return `${Math.round(generateNumberPlus())}`;
};

export const generateIndex = (length: number) => {
  return Math.round(generateNumberPlus()) % length;
};

export const generateBoolean = () => {
  const index = generateIndex(2);
  const results = [true, false];
  return results[index];
};

export const generateTokenModel = () => {
  return {
    path: `${generateAddress()}`,
    logoURI: "",
    name: "GNOT",
    symbol: "GNOLAND",
    amount: {
      value: BigNumber(generateNumberPlus()),
      denom: "ugnot",
    },
  };
};

export const generateToken0 = () => {
  return {
    token_id: `${generateAddress()}`,
    name: "GNOT",
    symbol: "GNOLAND",
    amount: {
      value: generateNumberPlus(),
      denom: "ugnot",
    },
  };
};

export const generateToken1 = () => {
  return {
    token_id: `${generateAddress()}`,
    name: "GNS",
    symbol: "GNOSWAP",
    amount: {
      value: generateNumberPlus(),
      denom: "ugnos",
    },
  };
};

export const generateInteger = (minNumber: number, maxNumber: number) => {
  return Math.round(Math.random() * (maxNumber - minNumber) + minNumber);
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

export const generateNumberPlus = () => {
  return generateNumber(1, 10000);
};

export const generateNumberMinus = () => {
  return generateNumber(-10000, 0);
};

export const generateTokenMetas = () => {
  const image0 =
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";
  const image1 =
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB98d4C97425d9908E66E53A6fDf673ACcA0BE986/logo.png";
  return {
    images: [image0, image1],
    names: ["GNOT", "GNS"],
  };
};

const generateRandomString = (length: number) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
