export type TokenChangeInfo = {
  path: string;
  name: string;
  symbol: string;
  logoURI: string;
  price: string;
  change: {
    status: "POSITIVE" | "NEGATIVE";
    value: string;
  };
};
