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
  packages.forEach((pacakgeInfo) => {
    test(`${pacakgeInfo.path} -> ${pacakgeInfo.address}`, () => {
      const result = getAddressByPackagePath(pacakgeInfo.path);
      expect(result).toBe(pacakgeInfo.address);
    });
  });
});