import { getStore } from "@netlify/blobs";

export const MAX_TEAMS = 12;

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

export async function body(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

export function regId() {
  return "FFMCL-" + Date.now().toString(36).toUpperCase();
}

const store = () => getStore("champion-league");

export async function getRegistrations() {
  return (await store().get("registrations", { type: "json" })) || [];
}

export async function saveRegistrations(rows) {
  await store().setJSON("registrations", rows);
}

/* Admin authentication */
export function makeAdminToken() {
  return process.env.ADMIN_PASSWORD || "";
}

export function validAdmin(request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ")
    ? auth.slice(7)
    : "";

  return !!process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}
