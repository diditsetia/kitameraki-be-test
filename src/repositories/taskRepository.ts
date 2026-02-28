import { container } from "../config/cosmosClient";
import { Task } from "../models/Task";

export const getTasks = async (
  page: number,
  pageSize: number,
  search?: string,
  status?: string,
) => {
  const offset = (page - 1) * pageSize;

  let query = `SELECT * FROM c WHERE 1=1`;
  const parameters: { name: string; value: any }[] = [];

  if (search) {
    query += ` AND CONTAINS(c.title, @search)`;
    parameters.push({ name: "@search", value: search });
  }

  if (status) {
    query += ` AND c.status = @status`;
    parameters.push({ name: "@status", value: status });
  }

  query += ` OFFSET @offset LIMIT @limit`;

  parameters.push(
    { name: "@offset", value: offset },
    { name: "@limit", value: pageSize },
  );

  const { resources } = await container.items
    .query({
      query,
      parameters,
    })
    .fetchAll();

  return resources as Task[];
};
