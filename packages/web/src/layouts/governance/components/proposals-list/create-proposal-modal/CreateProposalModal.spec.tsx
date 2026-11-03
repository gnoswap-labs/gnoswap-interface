import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { XGNS_TOKEN } from "@common/values/token-constant";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import CreateProposalModal from "./CreateProposalModal";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: "g1proposer" } }),
}));
jest.mock("@query/token", () => ({
  useGetGrc20Balances: jest.fn(),
}));

const { useGetGrc20Balances } = jest.requireMock("@query/token") as {
  useGetGrc20Balances: jest.Mock;
};

const renderModal = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const result = render(
    <QueryClientProvider client={client}>
      <GnoswapThemeProvider>
        <CreateProposalModal
          breakpoint={DEVICE_TYPE.WEB}
          setIsOpenCreateModal={jest.fn()}
          proposalCreationThreshold={1000}
          executablePackages={[]}
          executableFunctions={[]}
          proposeTextProposal={jest.fn()}
          proposeCommunityPoolSpendProposal={jest.fn()}
          proposeParamChangeProposal={jest.fn()}
        />
      </GnoswapThemeProvider>
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Governance:createModal.proposalDetails.placeholder.title"), {
    target: { value: "Proposal title" },
  });
  fireEvent.change(screen.getByPlaceholderText("Governance:createModal.proposalDetails.placeholder.description"), {
    target: { value: "Proposal description" },
  });
  return result;
};

describe("CreateProposalModal xGNS eligibility", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("allows the exact holding threshold independently of voting power", async () => {
    useGetGrc20Balances.mockReturnValue({
      isSuccess: true,
      data: { data: [{ path: XGNS_TOKEN.path, amount: "1000000000" }] },
    });
    renderModal();

    await waitFor(() => expect(screen.getByRole("button", { name: "Governance:createModal.submit.ok" })).toBeEnabled());
  });

  it("rejects a holding below the threshold even when another token balance is high", async () => {
    useGetGrc20Balances.mockReturnValue({
      isSuccess: true,
      data: {
        data: [
          { path: "gno.land/r/gnoswap/gns.GNS", amount: "999999999999" },
          { path: XGNS_TOKEN.path, amount: "999999999" },
        ],
      },
    });
    renderModal();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Governance:createModal.submit.insuffiXGNS" })).toBeDisabled(),
    );
  });

  it("does not label a pending or failed balance request as insufficient holdings", async () => {
    useGetGrc20Balances.mockReturnValue({ isSuccess: false, data: undefined });
    renderModal();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Governance:createModal.submit.ok" })).toBeDisabled(),
    );
  });
});
