import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { join } from "node:path";

export default async function migrations(request, response) {
  const client = await database.getNewClient();
  const migrationDefaultOptions = {
    dbClient: client,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationDefaultOptions);
    client.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationDefaultOptions,
      dryRun: false,
    });
    client.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
