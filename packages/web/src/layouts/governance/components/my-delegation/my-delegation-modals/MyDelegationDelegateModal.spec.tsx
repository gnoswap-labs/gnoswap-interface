import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { VerifiedDelegateInfo } from "@repositories/governance";

import MyDelegationDelegateModal from "./MyDelegationDelegateModal";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: jest.fn(),
}));

jest.mock("@hooks/token/data/use-token-amount-input", () => ({
  useTokenAmountInput: jest.fn(),
}));

jest.mock("@query/governance", () => ({
  useGetMyDelegation: jest.fn(),
}));

const { useWallet } = jest.requireMock("@hooks/wallet/data/use-wallet") as {
  useWallet: jest.Mock;
};
const { useTokenAmountInput } = jest.requireMock("@hooks/token/data/use-token-amount-input") as {
  useTokenAmountInput: jest.Mock;
};
const { useGetMyDelegation } = jest.requireMock("@query/governance") as {
  useGetMyDelegation: jest.Mock;
};

// Verified delegate aggregate voting power (raw, 6 decimals) = 5,000 xGNS.
const ONBLOC_ADDRESS = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";
const ONBLOC_AGGREGATE_VOTING_POWER_RAW = "5000000000";

// An unverified address with 1 xGNS received voting power (raw, 6 decimals).
const CUSTOM_ADDRESS = "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax";
const CUSTOM_RECEIVED_VOTING_WEIGHT_RAW = "1000000";

const delegatees: VerifiedDelegateInfo[] = [
  {
    address: ONBLOC_ADDRESS,
    description: "Onbloc delegate",
    logoURL: "",
    name: "Onbloc",
    votingPower: ONBLOC_AGGREGATE_VOTING_POWER_RAW,
    website: "https://onbloc.xyz",
  },
];

describe("MyDelegationDelegateModal", () => {
  const renderModal = () => {
    useWallet.mockReturnValue({ account: { address: CUSTOM_ADDRESS } });
    useTokenAmountInput.mockReturnValue({
      token: null,
      amount: "",
      balance: "0",
      usdValue: "0",
      changeAmount: jest.fn(),
      delegateButtonState: "ENTER_AMOUNT",
      delegateButtonText: "Governance:myDel.delModal.confirmBtn",
      isAvailableDelegate: false,
    });
    // Simulate the personal summary value independently of the verified list.
    useGetMyDelegation.mockReturnValue({
      data: { votingWeight: CUSTOM_RECEIVED_VOTING_WEIGHT_RAW },
    });

    const modal = (currentDelegatees: VerifiedDelegateInfo[]) => (
      <JotaiProvider>
        <GnoswapThemeProvider>
          <MyDelegationDelegateModal
            currentDelegatedDisplayAmount={0}
            totalDelegatedDisplayAmount={10000}
            apy={5}
            delegatees={currentDelegatees}
            isWalletConnected={true}
            connectWallet={jest.fn()}
            onSubmit={jest.fn()}
            setIsOpen={jest.fn()}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
    const { container, rerender } = render(modal(delegatees));

    // Move from MAIN into the delegatee selector stage.
    fireEvent.click(screen.getByText("Select"));

    // The voting power row has no accessible name of its own; scope to its value cell.
    const votingPowerValue = () => container.querySelector(".delegatee-info-rows .value.no-wrap");
    const refetchDelegatees = (next: VerifiedDelegateInfo[]) => rerender(modal(next));

    return { votingPowerValue, refetchDelegatees };
  };

  const typeSelfAddress = (address: string) => {
    fireEvent.click(screen.getByText("Governance:myDel.delModal.selectDel.self.chip"));
    fireEvent.change(screen.getByPlaceholderText("Governance:myDel.delModal.selectDel.self.placeholder"), {
      target: { value: address },
    });
  };

  it("shows the verified delegate's current aggregate votingPower after the list refetches", () => {
    const { votingPowerValue, refetchDelegatees } = renderModal();

    fireEvent.click(screen.getByText("Onbloc"));
    // Percentage is derived from the same aggregate value: 5,000 / 10,000 * 100 = 50%.
    expect(votingPowerValue()).toHaveTextContent(/^5,000 xGNS \(50%\)$/);

    refetchDelegatees([{ ...delegatees[0], votingPower: "6000000000" }]);
    expect(votingPowerValue()).toHaveTextContent(/^6,000 xGNS \(60%\)$/);
  });

  it("uses the verified list votingPower when a verified address is typed into Self-Delegate", () => {
    const { votingPowerValue } = renderModal();

    typeSelfAddress(ONBLOC_ADDRESS);

    // The personal summary (1 xGNS received) must not replace the verified aggregate.
    expect(votingPowerValue()).toHaveTextContent(/^5,000 xGNS \(50%\)$/);
  });

  it("uses received voting power for an unverified self-selected address", () => {
    const { votingPowerValue } = renderModal();

    typeSelfAddress(CUSTOM_ADDRESS);

    // 1 / 10,000 * 100 = 0.01%.
    expect(votingPowerValue()).toHaveTextContent(/^1 xGNS \(0\.01%\)$/);
  });
});
