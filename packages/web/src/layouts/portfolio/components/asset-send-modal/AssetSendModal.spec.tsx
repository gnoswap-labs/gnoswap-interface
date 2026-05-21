import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import AssetSendModal from "./AssetSendModal";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@hooks/common/use-esc-close-modal", () => jest.fn());

jest.mock("@hooks/wallet/ui/use-position-modal", () => ({
  usePositionModal: jest.fn(),
}));

jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: jest.fn(),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: jest.fn(),
}));

jest.mock("@components/common/select-pair-button/SelectPairButton", () => ({
  __esModule: true,
  default: ({ token }: { token: TokenModel | null }) => <span>{token?.displaySymbol ?? "Select"}</span>,
}));

const { useTokenData } = jest.requireMock("@hooks/token/data/use-token-data") as {
  useTokenData: jest.Mock;
};
const { useWallet } = jest.requireMock("@hooks/wallet/data/use-wallet") as {
  useWallet: jest.Mock;
};

const validAddress = "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax";

const token: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: validAddress,
  path: "gno.land/r/gns",
  tokenId: "gno.land/r/gns.GNS",
  decimals: 4,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "GRC20",
  priceID: "gno.land/r/gns",
};

describe("AssetSendModal", () => {
  const renderModal = ({ amount, handleSubmit = jest.fn() }: { amount: string; handleSubmit?: jest.Mock }) => {
    const setAmount = jest.fn();

    useTokenData.mockReturnValue({
      tokenPrices: {},
      displayBalanceMap: {
        [token.path]: 10,
      },
    });
    useWallet.mockReturnValue({
      account: {
        address: validAddress,
      },
    });

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <AssetSendModal
            amount={amount}
            setAmount={setAmount}
            isConfirm={false}
            breakpoint={DEVICE_TYPE.WEB}
            withdrawInfo={token}
            avgBlockTime={2.2}
            connected={true}
            close={jest.fn()}
            changeToken={jest.fn()}
            handleSubmit={handleSubmit}
            setIsConfirm={jest.fn()}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Wallet:assetSendModal.enterAddr.input"), {
      target: { value: validAddress },
    });

    return { handleSubmit, setAmount };
  };

  it("disables send when the amount is below one raw token unit", () => {
    const { handleSubmit } = renderModal({ amount: "0.00001" });

    const button = screen.getByRole("button", { name: "Wallet:assetSendModal.btn.lowAmt" });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("allows send when the amount equals one raw token unit", () => {
    const { handleSubmit } = renderModal({ amount: "0.0001" });

    const button = screen.getByRole("button", { name: "Wallet:assets.col.assetSend" });

    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledWith("0.0001", validAddress);
  });
});
