import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo from "./ActivityInfo";

describe("ActivityInfo Component", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the elapsed hour until the next full hour", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-18T12:00:00Z"));

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityInfo
            item={{
              ...dummyActivityData,
              time: "2026-09-18T09:30:00Z",
            }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });
});
