export const getSentiment = (s: number, f: number) => {
  const total = s + f;
  const successPercent = total === 0 ? 0 : (s / total) * 100;

  if (successPercent >= 90) {
    return "GREAT";
  } else if (successPercent >= 70) {
    return "GOOD";
  } else if (successPercent >= 50) {
    return "OKAY";
  } else {
    return "POOR";
  }
};
