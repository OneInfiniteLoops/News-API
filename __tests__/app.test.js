process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");

afterAll(() => {
  db.end();
});

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

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object of specified id (e.g. 2) in request endpoint, containing the following properties: author(username), title, article_id, body, topic, created_at, votes", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toEqual({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  describe("Error Handling", () => {
    test("404: Responds with 404 Error when endpoint is '/api/topic' – a valid but non-existent", () => {
      const article_id = 100;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Requested URL not found" });
        });
    });
  });
});
