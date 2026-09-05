import { json, body, makeAdminToken } from "./_utils.mjs";
export default async (req) => {
  if (req.method!=="POST") return json({error:"Method not allowed"},405);
  const {password} = await body(req);
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return json({error:"Invalid password."},401);
  return json({token:makeAdminToken()});
};
