import { render, screen } from "@testing-library/react";
import { MsgAddPackage, MsgCall, MsgRun, MsgSend } from "@gnolang/gno-js-client";
import { ContractMessage } from "@app-types/transaction-messages.types";
import { createDocument } from "@utils/messages.utils";
import TransactionApprovalModalContainer from "./TransactionApprovalModalContainer";

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ isSwitchNetwork: false, walletType: { type: "SOCIAL_WALLET" }, connected: true }),
}));
jest.mock("@query/token", () => ({ useGetTokenPrices: () => ({ data: undefined }) }));
jest.mock("@components/common/transaction-approval-modal/TransactionApprovalModal", () => ({
  __esModule: true,
  default: ({ caller }: { caller: string }) => <div data-testid="caller">{caller}</div>,
}));

const cases: { name: string; messages: ContractMessage[]; caller: string }[] = [
  { name: "empty", messages: [], caller: "" },
  {
    name: "unknown",
    // Simulate an unexpected runtime payload outside the supported message union.
    messages: JSON.parse("[{\"type\":\"/vm.future\",\"value\":{\"caller\":\"g1untrusted\"}}]"),
    caller: "",
  },
  {
    name: "call",
    messages: [{ type: "/vm.m_call", value: MsgCall.create({ caller: "g1caller" }) }],
    caller: "g1caller",
  },
  {
    name: "send",
    messages: [{ type: "/bank.MsgSend", value: MsgSend.create({ from_address: "g1sender" }) }],
    caller: "g1sender",
  },
  {
    name: "deployment",
    messages: [{ type: "/vm.m_addpkg", value: MsgAddPackage.create({ creator: "g1creator" }) }],
    caller: "g1creator",
  },
  {
    name: "run",
    messages: [{ type: "/vm.m_run", value: MsgRun.create({ caller: "g1runner" }) }],
    caller: "g1runner",
  },
];

test.each(cases)("displays the account for $name messages", ({ messages, caller }) => {
  const document = createDocument({
    accountSequence: 1,
    accountNumber: 1,
    chainId: "test-chain",
    messages,
    gasWanted: 1000,
    gasFee: 1,
  });
  render(<TransactionApprovalModalContainer document={document} onApprove={jest.fn()} onReject={jest.fn()} />);
  expect(screen.getByTestId("caller").textContent).toBe(caller);
});
