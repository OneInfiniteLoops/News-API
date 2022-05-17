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
  describe("Error Handling for GET /api/articles/:article_ids", () => {
    test("404: Responds with 404 Error when endpoint is '/api/articles/:article_id' – a valid but non-existent", () => {
      const article_id = 100;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Article not found" });
        });
    });
  });
  test("400: Responds with Error when endpoint '/api/articles/:article_id' is not valid e.g. string instead of number for article_id", () => {
    const article_id = "a";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ message: "Bad Request" });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("202: responds with article specified by id and updated votes property incremented by inc_votes as indicated within newVote's inc_votes property", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch(`/api/articles/2`)
      .send(newVote)
      .expect(202)
      .then((res) => {
        const { updatedArticle } = res.body;
        expect(updatedArticle).toEqual({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 10,
        });
      });
  });
  test("202: responds with article specified by id and updated votes property decremented by inc_votes when value indicated within newVote's inc_votes property is negative", () => {
    const newVote = { inc_votes: -10 };
    return request(app)
      .patch(`/api/articles/2`)
      .send(newVote)
      .expect(202)
      .then((res) => {
        const { updatedArticle } = res.body;
        expect(updatedArticle).toEqual({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -10,
        });
      });
  });
  describe("Error handling for patchVotesOfArticlesByID", () => {
    test("400: Responds with 400 Error when value of inc_votes is a string", () => {
      const newVote = { inc_votes: "one" };
      return request(app)
        .patch(`/api/articles/2`)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ message: "Bad Request" });
        });
    });
    test("400: Responds with 400 Error when request body (newVote) does not contain key of inc_votes (e.g. passed an empty object)", () => {
      const newVote = {};
      return request(app)
        .patch(`/api/articles/2`)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ message: "Bad Request" });
        });
    });
    test("404: Responds with 404 Error when inc_votes is valid but article does not exist", () => {
      const newVote = { inc_votes: 1 };
      const article_id = 200;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Article not found" });
        });
    });
    test("400: Responds with 400 Error when inc_votes is valid but articleId is not valid", () => {
      const newVote = { inc_votes: 1 };
      const article_id = "two";
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ message: "Bad Request" });
        });
    });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects each with the username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
      });
  });
  describe("Error handling", () => {
    test("404: Responds with 404 Error when endpoint is '/api/topic' – valid but non-existent", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Requested URL not found" });
        });
    });
  });
});
