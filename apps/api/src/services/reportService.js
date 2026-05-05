import { buildUsageReport, COURSES } from "@duolingo-tech/shared";
import { readDb } from "./store.js";

export async function getUsageReport() {
  const db = await readDb();
  return buildUsageReport(
    db.users.filter((user) => user.role === "student"),
    db.progress,
    db.catalog ?? COURSES,
    db.studySessions ?? []
  );
}
