import { json, getRegistrations, validAdmin } from "./_utils.mjs";
export default async (req) => {
  if (!validAdmin(req)) return json({error:"Unauthorized"},401);
  const rows = await getRegistrations();
  const safe = rows.map(r=>({...r})).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
  const stats = {total:rows.length,paid:rows.filter(r=>r.paymentStatus==="PAID").length,pending:rows.filter(r=>r.paymentStatus!=="PAID").length};
  return json({registrations:safe,stats});
};
