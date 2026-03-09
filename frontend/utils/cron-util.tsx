// utils/cron-util.ts
import cronstrue from "cronstrue";

export function getCronDescription(expression: string): string {
  try {
    return cronstrue.toString(expression, { use24HourTimeFormat: true });
  } catch (error) {
    throw new Error("Invalid Cron expression");
  }
}

export function validateCron(expression: string): boolean {
  const cronRegex =
    /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|[0-6]|\*\/[0-6])$/;
  return cronRegex.test(expression);
}
