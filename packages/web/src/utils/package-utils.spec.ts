import { bech32 } from "bech32";
import { getAddressByPackagePath } from "./package-utils";

const packages = [
  {
    path: "gno.land/r/gnoswap/v2/router",
    address: "g1cnz5gm2l09pm2k6rknjjar9a2w53fdhk4yjzy5",
  },
  {
    path: "gno.land/r/gnoswap/v2/pool",
    address: "g126swhfaq2vyvvjywevhgw7lv9hg8qan93dasu8",
  },
  {
    path: "gno.land/r/gnoswap/v2/position",
    address: "g1vsm68lq9cpn7x507s6gh59anmx86kxfhzyszu2",
  },
  {
    path: "gno.land/r/gnoswap/v2/staker",
    address: "g14fclvfqynndp0l6kpyxkpgn4sljw9rr96hz46l",
  },
  {
    path: "gno.land/r/gnoswap/v2/gov/staker",
    address: "g1gt2xzjcmhp2t08yh0nkmc3q822sr87t5n92rm0",
  },
];

describe("make address from package path", () => {
  packages.forEach(pacakgeInfo => {
    test(`${pacakgeInfo.path} -> ${pacakgeInfo.address}`, () => {
      const result = getAddressByPackagePath(pacakgeInfo.path);
      expect(result).toBe(pacakgeInfo.address);
    });
  });

  it("encodes the first 20 bytes of SHA-256 over the pkgPath:-prefixed path", () => {
    const address = getAddressByPackagePath("gno.land/r/gnoswap/protocol_fee");
    const { prefix, words } = bech32.decode(address);

    expect(prefix).toBe("g");
    expect(Buffer.from(bech32.fromWords(words)).toString("hex")).toBe("1c6af5f1999abc23b8147f0ed53f201c255f3de7");
  });
});
