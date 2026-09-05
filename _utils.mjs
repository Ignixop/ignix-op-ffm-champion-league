import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

export const MAX_TEAMS = 12;
export const ENTRY_FEE = 200;

export function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status, headers: {"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}

export function body(req) { return req.json().catch(()=>({})); }

export function clean(v, max=100) {
  return String(v ?? "").trim().replace(/\s+/g," ").slice(0,max);
}

export function regId() {
  return "IGNIX-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

export function sign(payload) {
  return crypto.createHmac("sha256", process.env.ADMIN_PASSWORD || "change-me").update(payload).digest("hex");
}
export function makeAdminToken() {
  const p = `${Date.now()}.${crypto.randomBytes(18).toString("hex")}`;
  return `${p}.${sign(p)}`;
}
export function validAdmin(req) {
  const h = req.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) return false;
  const token = h.slice(7);
  const i = token.lastIndexOf(".");
  if (i < 1) return false;
  const p = token.slice(0,i), sig = token.slice(i+1);
  const expected = sign(p);
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) && Date.now()-Number(p.split(".")[0]) < 1000*60*60*24;
}

export function store() {
  return getStore({name:"champion-league-data", consistency:"strong"});
}

export async function getRegistrations() {
  const s = store();
  return await s.get("registrations", {type:"json"}) || [];
}
export async function saveRegistrations(rows) {
  await store().setJSON("registrations", rows);
}
