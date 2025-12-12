import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const dataBaseName = process.env.POSTGRES_DB;

  const result = await database.query({
    text: `SELECT 
    (SELECT version()) AS version,
    (SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1) AS opened_connections,
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') AS max_connections`,
    values: [dataBaseName],
  });

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: result.rows[0].version,
        max_connections: result.rows[0].max_connections,
        opened_connections: result.rows[0].opened_connections,
      },
    },
  });
}

export default status;
