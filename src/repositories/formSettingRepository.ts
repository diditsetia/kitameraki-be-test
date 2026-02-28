import { formSettingsContainer } from "../config/cosmosClient";
import { FormSetting } from "../models/FormSetting";

const FORM_SETTING_ID = "global-form-setting";

export const getFormSetting = async (): Promise<FormSetting> => {
  try {
    const { resource } = await formSettingsContainer
      .item(FORM_SETTING_ID, FORM_SETTING_ID)
      .read<FormSetting>();

    if (!resource) {
      return createDefaultSetting();
    }

    return {
      id: resource.id,
      fields: resource.fields,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  } catch {
    return createDefaultSetting();
  }
};

export const upsertFormSetting = async (
  data: FormSetting,
): Promise<FormSetting> => {
  const now = new Date().toISOString();

  const payload: FormSetting = {
    ...data,
    updatedAt: now,
  };

  const { resource } =
    await formSettingsContainer.items.upsert<FormSetting>(payload);

  return {
    id: resource!.id,
    fields: resource!.fields,
    createdAt: resource!.createdAt,
    updatedAt: resource!.updatedAt,
  };
};

function createDefaultSetting(): FormSetting {
  const now = new Date().toISOString();

  return {
    id: FORM_SETTING_ID,
    fields: [
      {
        id: "title",
        label: "Title",
        type: "text",
        required: true,
        row: 0,
        column: 0,
        order: 0,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
