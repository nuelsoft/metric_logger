class Store {
  /**
   * Stores the data for the metric logger
   * It holds data in form:
   * {
   *   [key]: [
   *     Metric Data,
   *   ]
   * }
   *
   * @private
   * @type {Object.<string, Array<{time: number, value: number}>>}
   */
  static bucket;

  /**
   * duration in hours before data is deleted
   * @type number
   */
  static expiresAfter;

  /**
   * Initializes Store.
   * @param {boolean} startCleaner Determines if cleaner would be fired up immediately
   *
   * @param {number} persistenceTimePeriod  Persistence Time Period
   */
  static initialize({ startCleaner, persistenceTimePeriod }) {
    if (this.bucket) throw new Error("STORE: already initialized");
    this.bucket = {};
    this.expiresAfter = persistenceTimePeriod || 1;
    if (startCleaner) this.cleaner();

    console.log("STORE: initialized");
  }

  /**
   * @throws If Store isn't initialized
   * @returns boolean
   */
  static ensureInitialized() {
    if (this.bucket === null) throw "Store hasn't been initialized.";
    return true;
  }

  /**
   * Clears the data in bucket. Clear can be targeted to a key or the whole bucket
   * @param {string} key key in bucket to clear. If not specified. the whole bucket is cleared
   */
  static clear(key) {
    this.ensureInitialized();
    if (key) delete this.bucket[key];
    else this.bucket = {};
  }

  /**
   * Logs data with desired key in store bucket.
   *
   * @param {string} key Key in bucket to push data to
   * @param {number} value Number to log in store.
   *
   * @returns {{value: number}}
   */
  static push(key, value) {
    this.ensureInitialized();
    // Initializes key in bucket if already not.
    if (!this.bucket[key]) this.bucket[key] = [];
    this.bucket[key].push({ time: Date.now(), value });

    console.log("STORE: logged value", value, "into", key);

    return { value };
  }

  /**
   * Fetches logs within the time period specified
   *
   * @param key {string} Key to query bucket by
   * @param computeDataSum {boolean} whether or not to add sum in the returned data
   *
   * @returns null | {logs: {time: number, data: number}[], sum: number | undefined}
   */
  static fetch(key, { computeDataSum }) {
    this.ensureInitialized();
    if (!this.bucket[key]) return null;

    let sum = 0;

    /**
     * @type {{time: number, value: number}[]}
     */
    const retrieved = [];

    // Getting a value to query by. subtracting time period.
    const timeago = 3600000 * this.expiresAfter;
    const dateInPast = Date.now() - timeago;

    // Iterating through the list to certainly get data in time period.
    // This is a double check to make up for the 20seconds lapse time of the cleaner
    // The iteration however begins from the bottom of the list because the most recent
    // data will be at the bottom of the list.
    for (let i = this.bucket[key].length - 1; i >= 0; i--) {
      if (this.bucket[key][i].time >= dateInPast) {
        retrieved.push(this.bucket[key][i]);
        sum += this.bucket[key][i].value;
      } else break;
    }

    return {
      logs: retrieved,
      sum: computeDataSum ? sum : undefined,
    };
  }

  /**
   * periodic cleaner for Store.
   * cleans after every 10seconds
   * @private
   */
  static cleaner() {
    this.ensureInitialized();
    //10 seconds
    const cleaningInterval = 10000;

    const clean = () => {
      timeOut = setTimeout(clean, cleaningInterval);

      console.log("STORE: cleaning bucket");

      const timeago = 3600000 * this.expiresAfter;
      const dateInTimePast = Date.now() - timeago;
      //Linear lookup for all keys.
      for (const key of Object.keys(this.bucket)) {
        // Copy of key in bucket to avoid data mismanagement while unshifting
        // main bucket
        const copy = this.bucket[key];
        for (let i = 0; i < copy.length; i++) {
          if (copy[i].time < dateInTimePast) this.bucket[key].unshift();
          // break when condition is not met,
          // since data is by default sorted in time order
          else break;
        }
      }
    };

    let timeOut = setTimeout(clean, cleaningInterval);
  }
}

module.exports = Store;
