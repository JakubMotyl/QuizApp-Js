import { it, expect, describe } from "vitest";
import { shuffleQuestions } from "./main";

describe("shuffle", () => {
  it("should not return in the same order", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleQuestions(arr);
    expect(shuffled).not.toBe(arr);
  });
  it("should return same length", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleQuestions(arr);
    expect(shuffled).toHaveLength(arr.length);
  });
});
