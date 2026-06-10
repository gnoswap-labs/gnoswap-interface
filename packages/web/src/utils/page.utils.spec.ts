import { replaceRouteUrlWithoutNavigation } from "./page.utils";

describe("page.utils", () => {
  describe("replaceRouteUrlWithoutNavigation", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("replaces the current add route URL without creating a Next router transition", () => {
      window.history.replaceState(
        { key: "current", url: "/earn/add?tokenA=ugnot", as: "/earn/add?tokenA=ugnot" },
        "",
        "/earn/add?tokenA=ugnot",
      );
      const replaceState = jest.spyOn(window.history, "replaceState");

      replaceRouteUrlWithoutNavigation("/earn/add", "/earn/add?tokenA=ugnot&tokenB=gns");

      expect(replaceState).toHaveBeenCalledWith(
        { key: "current", url: "/earn/add?tokenA=ugnot&tokenB=gns", as: "/earn/add?tokenA=ugnot&tokenB=gns" },
        "",
        "/earn/add?tokenA=ugnot&tokenB=gns",
      );
      expect(`${window.location.pathname}${window.location.search}`).toBe("/earn/add?tokenA=ugnot&tokenB=gns");
    });

    it("preserves locale path prefixes when replacing an add route URL", () => {
      window.history.replaceState(
        { key: "current", url: "/ko/earn/add", as: "/ko/earn/add" },
        "",
        "/ko/earn/add?tokenA=ugnot",
      );
      const replaceState = jest.spyOn(window.history, "replaceState");

      replaceRouteUrlWithoutNavigation("/earn/add", "/earn/add?tokenA=ugnot&tokenB=gns");

      expect(replaceState).toHaveBeenCalledWith(
        { key: "current", url: "/ko/earn/add?tokenA=ugnot&tokenB=gns", as: "/ko/earn/add?tokenA=ugnot&tokenB=gns" },
        "",
        "/ko/earn/add?tokenA=ugnot&tokenB=gns",
      );
      expect(`${window.location.pathname}${window.location.search}`).toBe("/ko/earn/add?tokenA=ugnot&tokenB=gns");
    });

    it("does not replace the URL after the browser has left the add route", () => {
      window.history.replaceState({ key: "current" }, "", "/swap");
      const replaceState = jest.spyOn(window.history, "replaceState");

      replaceRouteUrlWithoutNavigation("/earn/add", "/earn/add?tokenA=ugnot");

      expect(replaceState).not.toHaveBeenCalled();
      expect(`${window.location.pathname}${window.location.search}`).toBe("/swap");
    });

    it("does not rewrite when the target URL already matches", () => {
      window.history.replaceState({ key: "current" }, "", "/earn/pool/add?poolPath=pool-1");
      const replaceState = jest.spyOn(window.history, "replaceState");

      replaceRouteUrlWithoutNavigation("/earn/pool/add", "/earn/pool/add?poolPath=pool-1");

      expect(replaceState).not.toHaveBeenCalled();
    });
  });
});
