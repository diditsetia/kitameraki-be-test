import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import {
  getFormSetting,
  upsertFormSetting,
} from "../repositories/formSettingRepository";
import { FormSetting } from "../models/FormSetting";

export async function GetFormSetting(): Promise<HttpResponseInit> {
  const setting = await getFormSetting();

  return {
    status: 200,
    jsonBody: setting,
  };
}

export async function UpdateFormSetting(
  request: HttpRequest,
): Promise<HttpResponseInit> {
  const body = (await request.json()) as Partial<FormSetting>;

  if (!body.fields || !Array.isArray(body.fields)) {
    return {
      status: 400,
      jsonBody: { message: "fields is required" },
    };
  }

  const now = new Date().toISOString();

  const data: FormSetting = {
    id: "global-form-setting",
    fields: body.fields,
    createdAt: body.createdAt ?? now,
    updatedAt: now,
  };

  const updated = await upsertFormSetting(data);

  return {
    status: 200,
    jsonBody: updated,
  };
}

app.http("GetFormSetting", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "form-settings",
  handler: GetFormSetting,
});

app.http("UpdateFormSetting", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "form-settings",
  handler: UpdateFormSetting,
});
