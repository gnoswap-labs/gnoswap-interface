export type TokenChangeInfo = {
  path: string;
  name: string;
  symbol: string;
  displaySymbol: string;
  logoURI: string;
  price: string;
  change: {
    status: "POSITIVE" | "NEGATIVE";
    value: string;
  };
};
