export const convertLiquidity = (price: string) => {
  if (price.length < 7) {
    return Number(price).toLocaleString();
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      return (
        (temp / 1e9).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "M"
      );
    }
    if (temp >= 1e3) {
      return (
        (temp / 1e3).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "K"
      );
    }
    return temp.toLocaleString("en-US");
  }
};
