import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../models/Task";
import { container } from "../config/cosmosClient";

export const createTask = async (
  status: TaskStatus,
  formData: Record<string, any>,
): Promise<Task> => {
  const now = new Date().toISOString();

  const newTask: Task = {
    id: uuidv4(),
    status,
    formData,
    createdAt: now,
    updatedAt: now,
  };

  await container.items.create(newTask);
  return newTask;
};

function mapTask(item: any) {
  return {
    id: item.id,
    status: item.status,
    formData: item.formData,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const getTasks = async (
  page: number,
  pageSize: number,
  search?: string,
  status?: TaskStatus,
  organizationId?: string,
) => {
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const parameters: any[] = [
    { name: "@offset", value: offset },
    { name: "@limit", value: pageSize },
  ];

  if (search) {
    conditions.push(
      "IS_DEFINED(c.formData.title) AND CONTAINS(LOWER(c.formData.title), LOWER(@search))",
    );
    parameters.push({ name: "@search", value: search });
  }

  if (status) {
    conditions.push("c.status = @status");
    parameters.push({ name: "@status", value: status });
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const dataQuery = {
    query: `
      SELECT *
      FROM c
      ${whereClause}
      ORDER BY c.createdAt ASC
      OFFSET @offset LIMIT @limit
    `,
    parameters,
  };

  const countQuery = {
    query: `
      SELECT VALUE COUNT(1)
      FROM c
      ${whereClause}
    `,
    parameters: parameters.filter(
      (p) => p.name !== "@offset" && p.name !== "@limit",
    ),
  };

  const { resources } = await container.items.query<any>(dataQuery).fetchAll();

  const items = resources.map(mapTask);

  const { resources: totalArr } = await container.items
    .query<number>(countQuery)
    .fetchAll();

  const total = totalArr[0] ?? 0;

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getTaskById = async (
  id: string,
  organizationId: String,
): Promise<Task | null> => {
  try {
    const { resource } = await container.item(id, id).read<any>();

    if (!resource) return null;

    return {
      id: resource.id,
      status: resource.status,
      formData: resource.formData,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  } catch (error) {
    return null;
  }
};

export const updateTask = async (
  id: string,
  data: Partial<{
    status: TaskStatus;
    formData: Record<string, any>;
  }>,
  organizationId: string,
): Promise<Task> => {
  const existing = await getTaskById(id, organizationId);
  if (!existing) throw new Error("Task not found");

  const patchRequests: any[] = [];

  if (data.status) {
    patchRequests.push({
      op: "replace",
      path: "/status",
      value: data.status,
    });
  }

  if (data.formData) {
    patchRequests.push({
      op: "replace",
      path: "/formData",
      value: data.formData,
    });
  }

  patchRequests.push({
    op: "replace",
    path: "/updatedAt",
    value: new Date().toISOString(),
  });

  const { resource } = await container.item(id, id).patch<any>(patchRequests);

  if (!resource) {
    throw new Error("Failed to update task");
  }

  return {
    id: resource.id,
    status: resource.status,
    formData: resource.formData,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus,
  organizationId: String,
): Promise<Task> => {
  const existing = await getTaskById(id, organizationId);

  if (!existing) {
    throw new Error("Task not found");
  }

  const updatedTask: Task = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };

  await container.item(id, id).replace(updatedTask);
  return updatedTask;
};

export const deleteTask = async (
  id: string,
  organizationId: String,
): Promise<void> => {
  const existing = await getTaskById(id, organizationId);

  if (!existing) {
    throw new Error("Task not found");
  }

  await container.item(id, id).delete();
};
