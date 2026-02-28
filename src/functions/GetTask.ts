import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getTaskById } from "../services/taskService";

export async function GetTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const organizationId = "default-org";

    if (!id) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: "Task id is required",
          data: null,
        },
      };
    }

    if (request.method === "GET") {
      const task = await getTaskById(id, organizationId);

      if (!task) {
        return {
          status: 404,
          jsonBody: {
            success: false,
            message: "Task not found",
            data: null,
          },
        };
      }

      return {
        status: 200,
        jsonBody: {
          success: true,
          message: "Task fetched successfully",
          data: task,
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

app.http("GetTask", {
  route: "tasks/{id}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetTask,
});
