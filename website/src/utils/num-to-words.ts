const numToWords = (number: number) => {
  if (number === 0) return 0;
  const abbrevs = ["", "k", "m", "b", "t"];
  let exponent = 0;

  while (number >= 1000 && exponent < abbrevs.length) {
    number /= 1000;
    exponent++;
  }

  if (exponent === 0) {
    return Math.floor(number);
  }

  return `${Number(number.toFixed(2))}${abbrevs[exponent]}`;
};

export default numToWords;
