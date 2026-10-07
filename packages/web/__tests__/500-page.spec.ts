// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require("../next.config");

describe("500 page", () => {
  it("redirects direct requests to the home page", async () => {
    await expect(nextConfig.redirects()).resolves.toContainEqual({
      source: "/500",
      destination: "/",
      permanent: false,
    });
  });
});
