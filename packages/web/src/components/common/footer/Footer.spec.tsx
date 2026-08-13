import Footer from "./Footer";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Footer Component", () => {
  const renderFooter = () =>
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Footer />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

  it("should render", () => {
    renderFooter();
  });

  it("links the Explore menu item to the explore page", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: "HeaderFooter:governanceSection.item.dashboard" })).toHaveAttribute(
      "href",
      "/explore",
    );
  });
});
