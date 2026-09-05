import { json, body, getRegistrations, saveRegistrations, validAdmin } from "./_utils.mjs";
export default async (req) => {
  if (!validAdmin(req)) return json({error:"Unauthorized"},401);
  const {id,status} = await body(req);
  if (!["REGISTERED","CONFIRMED","REJECTED","DISQUALIFIED"].includes(status)) return json({error:"Invalid status"},400);
  const rows=await getRegistrations(), r=rows.find(x=>x.registrationId===id);
  if(!r) return json({error:"Registration not found"},404);
  r.registrationStatus=status; r.updatedAt=new Date().toISOString();
  await saveRegistrations(rows); return json({ok:true});
};
