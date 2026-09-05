import { json, getRegistrations } from "./_utils.mjs";
export default async () => {
  const rows = await getRegistrations();
  const paidOrReserved = rows.filter(r=>r.paymentStatus==="PAID" && r.registrationStatus!=="REJECTED").length;
  return json({paidOrReserved});
};
