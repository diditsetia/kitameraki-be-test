import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { deleteTask } from "../services/taskService";

export async function DeleteTask(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const organizationId = "default-org";
    if (request.method === "DELETE") {
      await deleteTask(id, organizationId);

      return {
        status: 200,
        jsonBody: {
          success: true,
          message: "Task deleted successfully",
          data: null,
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
      },
    };
  }
}

app.http("DeleteTask", {
  route: "deletetasks/{id}",
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: DeleteTask,
});
