export type FieldType = "text" | "date" | "datetime" | "email";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  row: number;
  column: number; // 0 or 1 (max 2 kolom)
  order: number;
}

export interface FormSetting {
  id: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}
