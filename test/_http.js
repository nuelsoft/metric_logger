const mocha = require("mocha");
const MockDate = require("mockdate");
const supertest = require("supertest");
const app = require("../src/app");

const base = "/api/v1";

describe("Http Interface", () => {
  // after((done) => {
  //   app.close(done);
  // });

  describe("POST /metric/:key [Invalid Data]", () => {
    it("[should return a status 400 because invalid data was sent", (done) => {
      supertest(app)
        .post(`${base}/metric/active`)
        .send({ value: "invalid" })
        .expect(400)
        .end(done);
    });

    it("should return a status 200 because all requirements were satisfired", (done) => {
      supertest(app)
        .post(`${base}/metric/active`)
        .send({ value: 2.9 })
        .expect(201)
        .end(done);
    });
  });

  describe("GET /metric/:key ", () => {
    it("should return a status 200, and sum 3", (done) => {
      supertest(app)
        .get(`${base}/metric/active/sum`)
        .expect(200, "3")
        .end(done);
    });

    it("should return a status 404 because an inexistent key was used", (done) => {
      supertest(app).get(`${base}/metric/inexistent/sum`).expect(404).end(done);
    });
  });

  describe("GET /metric/:key", () => {
    before(() => MockDate.set(Date.now() + 3600000));
    after(() => MockDate.reset());
    it("should return a status 200, and sum 0", (done) => {
      supertest(app)
        .get(`${base}/metric/active/sum`)
        .expect(200, "0")
        .end(done);
    });
  });
});
