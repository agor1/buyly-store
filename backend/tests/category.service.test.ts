import { jest, describe, expect, it } from "@jest/globals";

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {},
}));

const { getCategory, getCategoryById } = await import(
  "../src/services/category.service.js"
);

describe("category.service", () => {
  it("returns a category by slug", async () => {
    await expect(getCategory("elektronika")).resolves.toEqual({
      id: "electronics",
      name: "Elektronika",
      slug: "elektronika",
    });
  });

  it("throws when category slug does not exist", async () => {
    await expect(getCategory("missing-category")).rejects.toThrow(
      "Category not found",
    );
  });

  it("returns a category by static id", () => {
    expect(getCategoryById("gaming")).toEqual({
      id: "gaming",
      name: "Gaming",
      slug: "gaming",
    });
  });

  it("throws when category id does not exist", () => {
    expect(() => getCategoryById("missing-category")).toThrow(
      "Invalid category ID",
    );
  });
});
