import { render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { DARK_THEME_COLORS, LIGHT_THEME_COLORS } from "@constants/theme.constant";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { GNOSWAP_THEME_KEY } from "@states/theme";

import { ProposalContentWrapper } from "./ViewProposalModal.styles";

const hexToRgb = (hexColor: string) => {
  const hex = hexColor.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map(value => value + value)
          .join("")
      : hex;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
};

const renderProposalContent = (themeKey: "dark" | "light") => {
  localStorage.setItem(GNOSWAP_THEME_KEY, JSON.stringify(themeKey));

  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ProposalContentWrapper>
          <div className="content" data-testid="markdown-content">
            <div className="markdown-style">
              <h1>Markdown Heading</h1>
              <p>Markdown Body</p>
            </div>
          </div>
        </ProposalContentWrapper>
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );
};

describe("ProposalContentWrapper markdown heading hierarchy", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it.each([
    {
      themeKey: "dark" as const,
      headingColor: DARK_THEME_COLORS.text03,
      bodyColor: DARK_THEME_COLORS.text04,
    },
    {
      themeKey: "light" as const,
      headingColor: LIGHT_THEME_COLORS.text03,
      bodyColor: LIGHT_THEME_COLORS.text04,
    },
  ])(
    "uses stronger heading color than body in $themeKey mode",
    async ({ themeKey, headingColor, bodyColor }) => {
      renderProposalContent(themeKey);

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1, name: "Markdown Heading" })).toBeTruthy();
      });

      const heading = screen.getByRole("heading", { level: 1, name: "Markdown Heading" });
      const content = screen.getByTestId("markdown-content");

      expect(getComputedStyle(heading).color).toBe(hexToRgb(headingColor));
      expect(getComputedStyle(content).color).toBe(hexToRgb(bodyColor));
      expect(getComputedStyle(heading).color).not.toBe(getComputedStyle(content).color);
    },
  );
});
