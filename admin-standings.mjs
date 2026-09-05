import { json, body, getRegistrations, saveRegistrations, validAdmin } from "./_utils.mjs";
export default async (req) => {
  if (!validAdmin(req)) return json({error:"Unauthorized"},401);
  const {standings=[]}=await body(req);
  const rows=await getRegistrations();
  for(const s of standings){
    const r=rows.find(x=>x.registrationId===s.registrationId);
    if(r){r.finalPoints=Math.max(0,Number(s.points)||0);r.finalKills=Math.max(0,Number(s.kills)||0);}
  }
  await saveRegistrations(rows); return json({ok:true});
};
