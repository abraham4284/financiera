// helpers/handleZodError.ts
import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = issue.path.join(".");
    acc[field] = issue.message;
    return acc;
  }, {});
}