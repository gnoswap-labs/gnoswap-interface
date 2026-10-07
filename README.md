# Gnoswap Interface
Welcome to the open source interface for Gnoswap, the first decentralized exchange (DEX) powered by Gno.land, designed to simplify concentrated liquidity experience and increase capital efficiency for traders.

_Note: Gnoswap is in active development and not yet in production, and we welcome your contributions! Please check our [contribution guidelines](https://github.com/gnoswap-labs/gnoswap-interface#contributing--support) and the [latest release](https://github.com/gnoswap-labs/gnoswap-interface/releases) to see the current development status._

## Project Overview
This repository hosts the codebase for the Gnoswap interface, which enables users to interact with Gnoswap. The interface is built using TypeScript and is designed to be user-friendly, secure, and accessible, despite having complex mechanisms such as concentrated liquidity and staking as part of its core service.

## Pool Price Chart

The pool detail shares one chart area between Price candles and Liquidity distribution. The Price view uses TradingView Lightweight Charts and requests UTC OHLCV windows from `/v1/pools/{encodedPoolPath}/ohlcv` with `interval`, `start`, and exclusive `end` Unix seconds. Intervals are 300, 900, 1800, 3600, 14400, 43200, or 86400 seconds (5m, 15m, 30m, 1h, 4h, 12h, 1d); All pages daily bars. Each window is capped at 120 intervals and 30 days. After the first pool-state price observation, intervals without a new observation carry the last close; swaps independently contribute token volume, and intervals without swaps have zero volume. Intervals before the first observation remain empty. The mobile layout retains tabs, price direction, zoom controls, and interval selector.

The pool API quotes whole token B per whole token A, with token decimals applied. Reversing the pair inverts OHLC, swaps high/low, and switches which of `volume0` and `volume1` is plotted; hovering shows both human token quantities alongside OHLC, with the candle time on the crosshair axis. Volumes are not USD. The header shows the current pool price derived from pool state; the hover hint explains that candles sample stored pool-state prices and may lag the current spot. Swaps contribute volume but do not set candle prices. The clickable TradingView attribution logo appears inside the chart.

## Token Price Candles

The token detail requests the same window parameters from `/v1/tokens/{encodedTokenPath}/ohlcv`. Its USD-per-token OHLC candles support 5m, 1h, 4h, and 1d intervals; All pages daily bars. Prices are sampled from the resolved token USD valuation (TWAP for regular tokens, external price for wrapped GNOT), independently of swaps. `volume` is the internally traded token quantity, while the separate 24h summary volume remains USD. Hovering shows OHLC and token volume, with the candle time on the crosshair axis; the token endpoint does not return counter-token volume or swap count. Both APIs return an unwrapped `{interval,start,end,data}` body with ISO UTC candle starts. Price samples can produce zero-volume bars without trades; swap-only intervals without a price observation and intervals before the first observation remain absent. Missing price observations are not filled from a previous close.

An empty window does not mark history exhausted: panning left searches the preceding window, or the Search older history button continues from an empty initial window. A failed older-page request leaves loaded bars and visible range in place; panning left again retries. An initial-page failure shows Retry.

## Development Setup
The Node.js version is 20.10.0.  
We recommend using [nvm](https://github.com/nvm-sh/nvm).

```bash
# If you don't have that version installed,
# $ nvm install

$ nvm use
```

We use [yarn berry](https://yarnpkg.com) to manage our packages.  
And we use the [yarn workspaces](https://yarnpkg.com/features/workspaces).

```bash
# If you don't have a yarn berry

$ npm i yarn -g
$ yarn set version berry
```

## Contributing & Support
If you would like to contribute to the Gnoswap Interface or need support, please consider the following options:
- Read our contributing guidelines: The [CONTRIBUTING.md](https://github.com/gnoswap-labs/gnoswap-interface/blob/develop/CONTRIBUTING.md) file provides detailed information on how to contribute to the project, including submitting pull requests, reporting issues, and suggesting improvements.
- Open an issue: If you encounter a bug, have a feature request, or want to suggest improvements, feel free to open an [issue](https://github.com/gnoswap-labs/gnoswap-interface/issues) in this repository.
//TODO: Add the community channel, Blog, and Twitter link.

## License
This project is licensed under the [GNU General Public License, Version 3.0](https://github.com/gnoswap-labs/gnoswap-interface/blob/develop/LICENSE). See the [full text](https://www.gnu.org/licenses/gpl-3.0.en.html) for details.
