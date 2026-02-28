import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const tasksContainerId = process.env.COSMOS_TASKS_CONTAINER;
const settingsContainerId = process.env.COSMOS_SETTINGS_CONTAINER;

if (
  !endpoint ||
  !key ||
  !databaseId ||
  !tasksContainerId ||
  !settingsContainerId
) {
  throw new Error("Cosmos environment variables not set!");
}

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

export const container = database.container(tasksContainerId);
export const formSettingsContainer = database.container(settingsContainerId);
