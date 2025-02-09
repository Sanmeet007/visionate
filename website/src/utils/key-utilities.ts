import Str from "@supercharge/strings";

const generateApiKey = () => {
  return Str.random(255);
};

export { generateApiKey };
