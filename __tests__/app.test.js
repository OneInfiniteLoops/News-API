process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects, containing 'slug' and 'description' as properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topics) => {
          expect(topics).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  describe("Error Handling", () => {
    test("404: Responds with 404 Error when endpoint is '/api/topic' – a valid but non-existent", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Requested URL not found" });
        });
    });
  });
});
