import Str from "@supercharge/strings";

const generateApiKey = () => {
  return Str.random(64);
};

export { generateApiKey };
