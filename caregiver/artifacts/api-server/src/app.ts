import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function convertNeo4jInts(data: any): any {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(convertNeo4jInts);
  if (typeof data === "object") {
    // Check for Neo4j Integer structure
    if (
      (typeof data.low === "number" && typeof data.high === "number") || 
      data.__is_integer__
    ) {
      // Convert to number. For most cases in this app, the values fit in JS numbers.
      return typeof data.toNumber === "function" ? data.toNumber() : Number(data.low);
    }
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertNeo4jInts(data[key]);
      }
    }
    return result;
  }
  return data;
}

app.use((_req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (body) {
      return originalJson.call(this, convertNeo4jInts(body));
    }
    return originalJson.call(this, body);
  };
  next();
});

app.use("/api", router);

export default app;
