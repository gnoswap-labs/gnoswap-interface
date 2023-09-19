import { FEE_RATE_OPTION, PriceRangeType } from "@constants/option.constant";
import {
  AddLiquidityFeeTier,
  AddLiquidityPriceRage,
} from "./EarnAddLiquidityContainer";

export const DUMMY_FEE_TIERS: AddLiquidityFeeTier[] = [
  {
    feeRate: FEE_RATE_OPTION.FEE_01,
    description: "Best for very stable pairs",
    range: "12",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_05,
    description: "Best for stable pairs",
    range: "67",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_3,
    description: "Best for most pairs",
    range: "21",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_1,
    description: "Best for exotic pairs",
    range: "0",
  },
];

export const DUMMY_PRICE_RANGE_MAP: {
  [key in PriceRangeType]: AddLiquidityPriceRage | undefined;
} = {
  Active: {
    range: {
      minPrice: "1300.5",
      maxPrice: "1589.5",
      minTick: "1.35",
      maxTick: "1.65",
    },
    apr: "105",
  },
  Passive: {
    range: {
      minPrice: "722.5",
      maxPrice: "2890",
      minTick: "0.75",
      maxTick: "3.0",
    },
    apr: "80",
  },
  Custom: {
    range: {
      minPrice: "722.5",
      maxPrice: "2890",
      minTick: "0.75",
      maxTick: "3.0",
    },
    apr: "80",
  },
};

export const DUMMY_POOL_TICKS = [
  {
    value: "1.073961138254532",
    price: "0.9802084688126746",
    tick: 0.9802084688126746,
  },
  {
    value: "3.073059326138406",
    price: "0.9811886772814872",
    tick: 0.9811886772814872,
  },
  {
    value: "-18.134954261462838",
    price: "0.9821698659587685",
    tick: 0.9821698659587685,
  },
  {
    value: "3.66521159311813",
    price: "0.9831520358247272",
    tick: 0.9831520358247272,
  },
  {
    value: "39.175366555249056",
    price: "0.9841351878605519",
    tick: 0.9841351878605519,
  },
  {
    value: "3.2228815099962276",
    price: "0.9851193230484123",
    tick: 0.9851193230484123,
  },
  {
    value: "48.468806410711174",
    price: "0.9861044423714606",
    tick: 0.9861044423714606,
  },
  {
    value: "54.92851483124098",
    price: "0.9870905468138319",
    tick: 0.9870905468138319,
  },
  {
    value: "34.93060212988513",
    price: "0.9880776373606457",
    tick: 0.9880776373606457,
  },
  {
    value: "58.898158538319116",
    price: "0.9890657149980062",
    tick: 0.9890657149980062,
  },
  {
    value: "42.511148168134525",
    price: "0.9900547807130041",
    tick: 0.9900547807130041,
  },
  {
    value: "59.09467848301594",
    price: "0.991044835493717",
    tick: 0.991044835493717,
  },
  {
    value: "63.57224846391675",
    price: "0.9920358803292106",
    tick: 0.9920358803292106,
  },
  {
    value: "60.51934609120303",
    price: "0.9930279162095397",
    tick: 0.9930279162095397,
  },
  {
    value: "78.35287274759652",
    price: "0.9940209441257492",
    tick: 0.9940209441257492,
  },
  {
    value: "82.07006674582651",
    price: "0.9950149650698747",
    tick: 0.9950149650698747,
  },
  {
    value: "86.64043005515893",
    price: "0.9960099800349446",
    tick: 0.9960099800349446,
  },
  {
    value: "89.17600329920441",
    price: "0.9970059900149794",
    tick: 0.9970059900149794,
  },
  {
    value: "100",
    price: "0.9980029960049942",
    tick: 0.9980029960049942,
  },
  {
    value: "100",
    price: "0.9990009990009991",
    tick: 0.9990009990009991,
  },
  {
    value: "100",
    price: "1",
    tick: 1,
  },
  {
    value: "100",
    price: "1.001",
    tick: 1.001,
  },
  {
    value: "100",
    price: "1.0020009999999997",
    tick: 1.0020009999999997,
  },
  {
    value: "87.45649170423994",
    price: "1.0030030009999997",
    tick: 1.0030030009999997,
  },
  {
    value: "83.44334373900584",
    price: "1.0040060040009995",
    tick: 1.0040060040009995,
  },
  {
    value: "80.77769393647627",
    price: "1.0050100100050003",
    tick: 1.0050100100050003,
  },
  {
    value: "67.41998453824951",
    price: "1.0060150200150053",
    tick: 1.0060150200150053,
  },
  {
    value: "75.21903648844791",
    price: "1.0070210350350202",
    tick: 1.0070210350350202,
  },
  {
    value: "78.26482882716132",
    price: "1.0080280560700552",
    tick: 1.0080280560700552,
  },
  {
    value: "55.7200253355104",
    price: "1.009036084126125",
    tick: 1.009036084126125,
  },
  {
    value: "56.96694253686708",
    price: "1.0100451202102512",
    tick: 1.0100451202102512,
  },
  {
    value: "42.085152964383454",
    price: "1.0110551653304611",
    tick: 1.0110551653304611,
  },
  {
    value: "29.59451072646806",
    price: "1.0120662204957915",
    tick: 1.0120662204957915,
  },
  {
    value: "21.211739395363708",
    price: "1.0130782867162873",
    tick: 1.0130782867162873,
  },
  {
    value: "51.47281147160517",
    price: "1.0140913650030035",
    tick: 1.0140913650030035,
  },
  {
    value: "14.497330891553844",
    price: "1.0151054563680064",
    tick: 1.0151054563680064,
  },
  {
    value: "10.731671509578433",
    price: "1.0161205618243743",
    tick: 1.0161205618243743,
  },
  {
    value: "17.80906412507565",
    price: "1.0171366823861985",
    tick: 1.0171366823861985,
  },
  {
    value: "38.586301175029746",
    price: "1.0181538190685846",
    tick: 1.0181538190685846,
  },
  {
    value: "9.50528530112382",
    price: "1.0191719728876532",
    tick: 1.0191719728876532,
  },
];
