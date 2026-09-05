import { json, body, clean, getRegistrations, MAX_TEAMS } from "./_utils.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({error:"Method not allowed"},405);
  const x = await body(req);
  const code = clean(x.registrationCode,30).toUpperCase();
  if (!code) return json({error:"Enter your registration code."},400);

  const validCodes = (process.env.REGISTRATION_CODES || "")
    .split(",").map(v=>v.trim().toUpperCase()).filter(Boolean);

  if (!validCodes.includes(code))
    return json({error:"Invalid registration code. Get the code from IGNIX OP after your ₹200 payment is confirmed."},403);

  const rows = await getRegistrations();
  const active = rows.filter(r => r.paymentStatus === "PAID" && r.registrationStatus !== "REJECTED");
  if (active.length >= MAX_TEAMS) return json({error:"All 12 tournament slots are currently full."},409);

  if (rows.some(r => r.registrationCode === code))
    return json({error:"This registration code has already been used."},409);

  return json({valid:true});
};
