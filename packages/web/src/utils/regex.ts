export const REGEX_NUMBER_FORMAT = /\.00|(\.\d*?)0+$/g;

export const cutDecimalNumberWithoutRounding = (digits: number) => new RegExp("^-?\\d+(?:\.\\d{0," + (digits || -1) + "})?");