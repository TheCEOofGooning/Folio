import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;
function getClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return (client ??= neon(process.env.DATABASE_URL));
}

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
  return (await getClient().query(text, params)) as T[];
}
