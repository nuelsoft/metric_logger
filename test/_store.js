const assert = require("assert");
const Store = require("../src/_store");

const storeTestValue = 100;

describe("Store", () => {
  describe("#Initialize", () => {
    it("should initialize store without errors", () => {
      Store.initialize({ startCleaner: false });
    });
  });

  describe("#Puser", () => {
    it(`should pushed ${storeTestValue} to bucket`, () => {
      Store.push("key", storeTestValue);
    });
  });

  describe("#Fetch", () => {
    it(`should return ${storeTestValue}`, () => {
      assert.strictEqual(
        Store.fetch("key", { computeDataSum: true }).sum,
        storeTestValue
      );
    });
  });
});
