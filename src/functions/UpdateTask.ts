import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TaskStatus } from "../models/Task";
import { updateTask } from "../services/taskService";

const isValidStatus = (status: any): status is TaskStatus =>
  ["Todo", "InProgress", "Done"].includes(status);

export async function UpdateTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const body = (await request.json()) as any;
    const organizationId = "default-org";

    if (!body || typeof body !== "object") {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: "Invalid request body",
        },
      };
    }

    const data: Partial<{
      status: TaskStatus;
      formData: Record<string, any>;
    }> = {};

    if (body.status) {
      if (!isValidStatus(body.status)) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "Invalid status value",
          },
        };
      }
      data.status = body.status;
    }

    if (body.formData) {
      if (typeof body.formData !== "object") {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "formData must be an object",
          },
        };
      }
      data.formData = body.formData;
    }

    const updated = await updateTask(id, data, organizationId);

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: "Task updated successfully",
        data: updated,
      },
    };
  } catch (error) {
    context.error("UpdateTask error:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: "Internal server error",
      },
    };
  }
}

app.http("UpdateTask", {
  route: "updatetasks/{id}",
  methods: ["PUT"],
  authLevel: "anonymous",
  handler: UpdateTask,
});
