import { json, body, clean, regId, getRegistrations, saveRegistrations, MAX_TEAMS } from "./_utils.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({error:"Method not allowed"},405);
  const x = await body(req);
  const required = ["registrationCode","teamName","captainName","phone","email","player1","player2","player3","player4","uid1","uid2","uid3","uid4"];
  for (const k of required) if (!clean(x[k])) return json({error:`Missing ${k}`},400);

  const code = clean(x.registrationCode,30).toUpperCase();
  const validCodes = (process.env.REGISTRATION_CODES || "")
    .split(",").map(v=>v.trim().toUpperCase()).filter(Boolean);

  if (!validCodes.includes(code))
    return json({error:"Invalid registration code. Get the code from IGNIX OP after your ₹200 payment is confirmed."},403);

  let rows = await getRegistrations();
  const active = rows.filter(r => r.paymentStatus==="PAID" && r.registrationStatus !== "REJECTED");
  if (active.length >= MAX_TEAMS) return json({error:"All 12 tournament slots are currently full."},409);

  if (rows.some(r => r.registrationCode === code))
    return json({error:"This registration code has already been used."},409);

  const teamName = clean(x.teamName,40);
  if (rows.some(r => r.teamName.toLowerCase() === teamName.toLowerCase() && r.registrationStatus !== "REJECTED"))
    return json({error:"That team name is already registered."},409);

  const phone = clean(x.phone,15).replace(/\D/g,"");
  if (phone.length < 10) return json({error:"Enter a valid WhatsApp number."},400);

  const email = clean(x.email,100).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({error:"Enter a valid email."},400);

  const id = regId();
  rows.push({
    registrationId:id, registrationCode:code, createdAt:new Date().toISOString(),
    teamName, captainName:clean(x.captainName,50), phone, email,
    players:[
      {name:clean(x.player1,40),uid:clean(x.uid1,30)},
      {name:clean(x.player2,40),uid:clean(x.uid2,30)},
      {name:clean(x.player3,40),uid:clean(x.uid3,30)},
      {name:clean(x.player4,40),uid:clean(x.uid4,30)}
    ],
    paymentStatus:"PAID", registrationStatus:"CONFIRMED", amount:200,
    paymentMethod:"MANUAL"
  });
  await saveRegistrations(rows);
  return json({registrationId:id});
};
