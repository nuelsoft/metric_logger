const assert = require("assert");
const MockDate = require("mockdate");

const Store = require("../src/_store");

const storeTestValue = 100;

describe("Store", () => {
  before((done) => {
    //uninitialize any running instance of the bucket.
    Store.bucket = null;
    done();
  });

  describe("#Initialize", () => {
    it("should initialize store without errors", () => {
      Store.initialize({ startCleaner: false });
    });
  });

  describe("#Push", () => {
    it(`should push ${storeTestValue} to bucket`, () => {
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

  describe("#FetchExpired", () => {
    before(() => MockDate.set(Date.now() + 3600000));
    after(() => MockDate.reset());
    it("should return 0 as time is expired", () => {
      assert.strictEqual(Store.fetch("key", { computeDataSum: true }).sum, 0);
    });
  });
});
