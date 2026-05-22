import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import TokenDescriptionLinks from "./TokenDescriptionLinks";

describe("TokenDescriptionLinks", () => {
  const originalCanParse = URL.canParse;

  beforeAll(() => {
    Object.defineProperty(URL, "canParse", {
      configurable: true,
      value: (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(URL, "canParse", {
      configurable: true,
      value: originalCanParse,
    });
  });

  const renderComponent = () => {
    return render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenDescriptionLinks
            links={{
              Website: "https://gnoswap.io",
              X: "https://x.com/gnoswaplabs",
              Discord: "https://discord.com/invite/u4bdGHStb2",
              Docs: "https://docs.gnoswap.io",
              GnoScan: "https://gnoscan.io/tokens/r/demo/wugnot",
              Unsafe: "javascript:alert(1)",
              Invalid: "not-a-url",
            }}
            copied={false}
            copyClick={jest.fn()}
            path="gno.land/r/demo/wugnot"
            isLoading={false}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  };

  it("renders safe token links only", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: /Website/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /X/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Discord/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Docs/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GnoScan/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Unsafe/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Invalid/i })).not.toBeInTheDocument();
  });
});
