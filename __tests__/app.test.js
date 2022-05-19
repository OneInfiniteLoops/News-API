process.env.NODE_ENV = "test";

const { app } = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");
require("jest-sorted");

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
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
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
        expect(article).toMatchObject({
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
describe("GET /api/articles/:article_id (comment count)", () => {
  test("200: Responds with article specified by id, adding comment_count property that compiles the total count of comments linked to the specified article by article_id", () => {
    const article_id = 5;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: expect.any(String),
          votes: 0,
          comment_count: expect.any(String),
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, each with author(username), title, article_id, topic, created_at, votes,comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with array of article objects sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSorted("created_at", { descending: true });
      });
  });
  test("200: Responds with an array of article objects filtered by topic 'cats' when topic 'cats' is specified in query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with array of articles sorted by a non-default valid column, when article_id is specified as sort_by in query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("article_id");
      });
  });
  test("200: Responds with array of articles ordered by a non-default valid ORDER, when 'ASC' is specified as order in query", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSorted("created_at", { descending: false });
      });
  });
  describe("Error handling for GET /api/articles", () => {
    test("404: Responds with 404 error when endpoint is GET/api/article (non-existent path)", () => {
      return request(app)
        .get("/api/article")
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ message: "Requested URL not found" });
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the article given by article_id, each comment contains comment_id, votes, created_at, author and body as properties", () => {
    const article_id = 5;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with empty array for comments when article given by article_id is valid and exists, but does not have any comments yet", () => {
    const article_id = 8;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toEqual([]);
      });
  });
  describe("Error handling for GET/api/articles/:article_id/comments", () => {
    test("404: Responds with 404 error stating article comments not found when article_id passed is valid but does not yet exist", () => {
      const article_id = 100;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Comments and article does not exist",
          });
        });
    });
    test("400: Responds with Error when article_id passed is not valid e.g. string instead of number for article_id", () => {
      const article_id = "a";
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ message: "Bad Request" });
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with newly posted comment, when request body passed contains existing username and body as properties", () => {
    const article_id = 5;
    const newComment = {
      username: "butter_bridge",
      body: "An insightful article!",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then((res) => {
        const { postedComment } = res.body;
        expect(postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: "An insightful article!",
          article_id: 5,
          username: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  describe("Error handling for POST /api/articles/:article_id/comments", () => {
    test("404: responds with 404 error article not found when article_id passed is valid but the corresponding article does not yet exist", () => {
      const article_id = 100;
      const newComment = {
        username: "butter_bridge",
        body: "An insightful article!",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Cannot post comment - article does not exist",
          });
        });
    });
    test("404: responds with 404 error when article exists, but author(username) does not yet exist in the users db", () => {
      const article_id = 5;
      const newComment = {
        username: "non_existent_user",
        body: "An insightful article!",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Cannot post comment - username is not recognised",
          });
        });
    });
    test("400: responds with 400 error when article_id passed is not valid (datatype is a string instead of a number)", () => {
      const article_id = "a";
      const newComment = {
        username: "butter_bridge",
        body: "An insightful article!",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Bad Request",
          });
        });
    });
    test("400: responds with 400 error when missing required field, newComment passed is empty", () => {
      const article_id = 5;
      const newComment = {};
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Bad Request",
          });
        });
    });
  });
});
