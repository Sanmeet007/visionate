const wait = async (ms: number) => {
  return new Promise((res) => {
    setTimeout(() => {
        return res(null);
    }, ms);
  });
};

export default wait;