import { CosmosClient } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TaskStatus } from "../models/Task";
import { createTask } from "../services/taskService";

interface CreateTaskBody {
  status?: TaskStatus;
  formData: Record<string, unknown>;
}

const isValidStatus = (status: any): status is TaskStatus => {
  return ["Todo", "InProgress", "Done"].includes(status);
};

export async function InsertTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    if (request.method === "POST") {
      const body = (await request.json()) as unknown;

      if (typeof body !== "object" || body === null || !("formData" in body)) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "Invalid request body",
            data: null,
          },
        };
      }

      const { status, formData } = body as CreateTaskBody;

      if (!formData || typeof formData !== "object") {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "formData must be an object",
            data: null,
          },
        };
      }

      const finalStatus: TaskStatus =
        status && isValidStatus(status) ? status : "Todo";

      const created = await createTask(finalStatus, formData);

      return {
        status: 201,
        jsonBody: {
          success: true,
          message: "Task created successfully",
          data: created,
        },
      };
    }

    return {
      status: 405,
      jsonBody: {
        success: false,
        message: "Method not allowed",
        data: null,
      },
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: "Internal server error",
        data: null,
      },
    };
  }
}

app.http("InsertTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: InsertTask,
});
