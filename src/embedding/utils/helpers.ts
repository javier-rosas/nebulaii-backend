import { get_encoding } from "@dqbd/tiktoken";
import { MAX_TOKENS } from "@/constants";

const countTokens = (content: string): number => {
  const encoding = get_encoding("cl100k_base");
  const numTokens = encoding.encode(content).length;
  encoding.free();
  return numTokens;
};

export const isExcedesMaxTokens = (content: string): boolean => {
  const numTokens = countTokens(content);
  return numTokens > MAX_TOKENS;
};
