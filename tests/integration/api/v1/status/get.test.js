test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.update_at).toBeDefined();

  const pharsedUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toBe(pharsedUpdateAt);

  expect(
    responseBody.dependencies.database.max_connections,
  ).toBeGreaterThanOrEqual(1);

  expect(responseBody.dependencies.database.opened_connections).toEqual(1);

  expect(responseBody.dependencies.database.version).toBeDefined();
});
