const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../app");

function startTestServer(database) {
  const app = createApp({ database, clientOrigin: "*" });
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function withServer(database, callback) {
  const { server, baseUrl } = await startTestServer(database);
  try {
    await callback(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("health endpoint confirms the database query", async () => {
  const database = { execute: async () => [[{ database_ok: 1 }]] };
  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      data: { status: "ok", database: "connected" },
    });
  });
});

test("event search builds parameterized filters", async () => {
  let captured;
  const database = {
    execute: async (sql, parameters) => {
      captured = { sql, parameters };
      return [[{ id: 3, name: "Harbour Fun Run" }]];
    },
  };

  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/events/search?date=2026-10-18&location=Harbour&category=1`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.meta.count, 1);
    assert.match(captured.sql, /DATE\(e\.start_datetime\) = \?/);
    assert.deepEqual(captured.parameters, [
      "2026-10-18",
      "%Harbour%",
      "%Harbour%",
      "%Harbour%",
      1,
    ]);
  });
});

test("event search rejects invalid dates", async () => {
  const database = { execute: async () => { throw new Error("Database must not be called"); } };
  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/events/search?date=not-a-date`);
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error.code, "INVALID_DATE");
  });
});

test("event search rejects impossible calendar dates", async () => {
  const database = { execute: async () => { throw new Error("Database must not be called"); } };
  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/events/search?date=2026-02-30`);
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error.code, "INVALID_DATE");
  });
});

test("event details return a clear 404", async () => {
  const database = { execute: async () => [[]] };
  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/events/999`);
    const body = await response.json();
    assert.equal(response.status, 404);
    assert.equal(body.error.code, "EVENT_NOT_FOUND");
  });
});

test("event details only expose active records", async () => {
  let capturedSql;
  const database = {
    execute: async (sql) => {
      capturedSql = sql;
      return [[{ id: 3, name: "Harbour Hope Fun Run" }]];
    },
  };

  await withServer(database, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/events/3`);
    assert.equal(response.status, 200);
    assert.match(capturedSql, /e\.status = 'active'/);
  });
});
