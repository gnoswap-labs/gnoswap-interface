# Gnoswap Interface
Welcome to the open source interface for Gnoswap, the first decentralized exchange (DEX) powered by Gno.land, designed to simplify concentrated liquidity experience and increase capital efficiency for traders.

_Note: Gnoswap is in active development and not yet in production, and we welcome your contributions! Please check our [contribution guidelines](https://github.com/gnoswap-labs/gnoswap-interface#contributing--support) and the [latest release](https://github.com/gnoswap-labs/gnoswap-interface/releases) to see the current development status._

## Project Overview
This repository hosts the codebase for the Gnoswap interface, which enables users to interact with Gnoswap. The interface is built using TypeScript and is designed to be user-friendly, secure, and accessible, despite having complex mechanisms such as concentrated liquidity and staking as part of its core service.

## Pool Price Chart

The pool detail shares one chart area between Price candles and the Liquidity distribution. The Price view uses TradingView Lightweight Charts and loads sparse, UTC-aligned OHLCV bars from `/v1/tradingview/history` at 5-minute, 1-hour, 4-hour, or daily intervals. All uses daily bars and loads older history when panned left. Both views use the same reversible token pair; the mobile layout keeps the tabs, price direction, zoom controls, and interval selector within the chart card.

Prices apply token decimals before display; reversing the pair inverts OHLC and swaps high/low. USD volume is estimated from the directional input amount and its stored token price, which may differ from the price at the trade block. TradingView attribution remains visible beneath the chart.

## Token Price Candles

The token detail chart keeps its existing line view and offers a Candles mode with 5-minute, hourly, and daily USD OHLC bars from `/v1/tokens/{tokenPath}/candles`. Mode and interval controls live inside the chart. Candles display USD swap volume, preserve gaps with no recorded price samples, and load older bars when panned left. Historical candles begin when the API's recording source becomes available; the line view remains usable independently.

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
