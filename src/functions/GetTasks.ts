import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TaskStatus } from "../models/Task";
import { getTasks } from "../services/taskService";

const isValidStatus = (status: any): status is TaskStatus => {
  return ["Todo", "InProgress", "Done"].includes(status);
};

export async function GetTasks(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    if (request.method !== "GET") {
      return {
        status: 405,
        jsonBody: {
          success: false,
          message: "Method not allowed",
          data: null,
        },
      };
    }

    const page = Number(request.query.get("page") ?? 1);
    const pageSize = Number(request.query.get("pageSize") ?? 5);
    const search = request.query.get("search") ?? undefined;
    const statusParam = request.query.get("status");
    const organizationId = "default-org";

    const status = isValidStatus(statusParam) ? statusParam : undefined;

    const result = await getTasks(
      page,
      pageSize,
      search,
      status,
      organizationId,
    );

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: "Tasks fetched successfully",
        data: result,
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

app.http("GetTasks", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetTasks,
});
