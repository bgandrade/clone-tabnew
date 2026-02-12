import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("GET /api/v1/migrations", () => {
  describe("Anonymus user", () => {
    test("Retrieving current system status", async () => {
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
  });
});
