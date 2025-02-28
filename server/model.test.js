const request = require("supertest");
const app = require("./index");
const pool = require("./db");

afterAll(async () => {
  await pool.end();
});

function mockDb() {
  return jest.spyOn(pool, "query").mockImplementationOnce(() => {
    throw new Error("database error");
  });
}

test("get an event", async () => {
  const res = await request(app).get("/api/events/168");
  expect(res.status).toBe(200);
});
