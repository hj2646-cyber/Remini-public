import * as dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import app from "./app";

const rawPort = process.env["API_PORT"] || process.env["PORT"] || "5000";

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
