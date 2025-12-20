import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const host = "http://localhost:3000/api/v1/status";
      console.log("Tenstando se conectar ao webserver no host: " + host);
      const response = await fetch(host);
      if (response.status !== 200) throw new Error();
    }
  }
}

export default {
  waitForAllServices,
};
