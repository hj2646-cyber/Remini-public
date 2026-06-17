import neo4j, { Driver, Session } from "neo4j-driver";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI;
    const username = process.env.NEO4J_USERNAME ?? "neo4j";
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !password) {
      throw new Error("NEO4J_URI and NEO4J_PASSWORD environment variables are required");
    }

    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }
  return driver;
}

function convertNeo4jData(data: any): any {
  if (data === null || data === undefined) return data;
  
  // Neo4j Integer check
  if (neo4j.isInt(data)) {
    const num = data.toNumber();
    return num;
  }
  
  // Neo4j Node or Relationship
  if (typeof data === "object" && "properties" in data) {
    return convertNeo4jData(data.properties);
  }
  
  if (Array.isArray(data)) {
    return data.map(convertNeo4jData);
  }
  
  if (typeof data === "object" && data.constructor === Object) {
    const result: any = {};
    for (const key in data) {
      result[key] = convertNeo4jData(data[key]);
    }
    return result;
  }
  
  return data;
}

export async function runQuery<TItems = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<TItems[]> {
  const database = process.env.NEO4J_DATABASE;
  const session: Session = database
    ? getNeo4jDriver().session({ database })
    : getNeo4jDriver().session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((r) => {
      const obj: any = {};
      r.keys.forEach((key) => {
        obj[key] = convertNeo4jData(r.get(key));
      });
      return obj as TItems;
    });
  } catch (err) {
    console.error(`[Neo4j Error] Query failed: ${cypher} | Error: ${err}`);
    throw err;
  } finally {
    await session.close();
  }
}

export async function checkNeo4jConnection(): Promise<boolean> {
  try {
    await runQuery("RETURN 1 AS ok");
    return true;
  } catch {
    return false;
  }
}
