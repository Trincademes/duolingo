import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../../data/db.json");
const STORE_DRIVER = process.env.STORE_DRIVER ?? "json";
const DYNAMODB_TABLE = process.env.AWS_DYNAMODB_TABLE ?? "duotech-app-state";
const DYNAMODB_KEY = process.env.AWS_DYNAMODB_KEY ?? "default";

const dynamoClient = STORE_DRIVER === "dynamodb"
  ? DynamoDBDocumentClient.from(new DynamoDBClient({}))
  : null;

// Camada unica de persistencia: alterna entre JSON local e DynamoDB via STORE_DRIVER.
export async function readDb() {
  if (STORE_DRIVER === "dynamodb") {
    return readDynamoDb();
  }

  const raw = await readFile(DB_PATH, "utf8");
  return JSON.parse(raw);
}

export async function writeDb(data) {
  if (STORE_DRIVER === "dynamodb") {
    return writeDynamoDb(data);
  }

  await writeFile(DB_PATH, JSON.stringify(data, null, 2));
  return data;
}

export async function updateDb(updater) {
  // Clona o estado para evitar mutacao acidental antes da escrita definitiva.
  const current = await readDb();
  const next = await updater(structuredClone(current));
  await writeDb(next);
  return next;
}

async function readSeedDb() {
  const raw = await readFile(DB_PATH, "utf8");
  return JSON.parse(raw);
}

async function readDynamoDb() {
  const result = await dynamoClient.send(new GetCommand({
    TableName: DYNAMODB_TABLE,
    Key: {
      pk: DYNAMODB_KEY
    }
  }));

  if (result.Item?.data) {
    return result.Item.data;
  }

  // Na primeira execucao em DynamoDB, reaproveita o JSON como seed academico.
  const seed = await readSeedDb();
  await writeDynamoDb(seed);
  return seed;
}

async function writeDynamoDb(data) {
  await dynamoClient.send(new PutCommand({
    TableName: DYNAMODB_TABLE,
    Item: {
      pk: DYNAMODB_KEY,
      data,
      updatedAt: new Date().toISOString()
    }
  }));

  return data;
}
