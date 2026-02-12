import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const host = "http://localhost:3000/api/v1/status";
      const response = await fetch(host);
      if (response.status !== 200) throw new Error();
    }
  }
}

async function cleardDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  cleardDatabase,
};
export default orchestrator;
