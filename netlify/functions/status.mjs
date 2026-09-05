import { json, getRegistrations, clean } from "./_utils.mjs";
export default async (req) => {
  const id = clean(new URL(req.url).searchParams.get("id"),30);
  if (!id) return json({error:"Enter a registration ID."},400);
  const r = (await getRegistrations()).find(x=>x.registrationId===id);
  if (!r) return json({error:"Registration ID not found."},404);
  let message = "Payment is pending. Use the payment link sent after registration.";
  if (r.paymentStatus==="PAID") message = "Payment verified by Razorpay. Your slot is reserved.";
  if (r.registrationStatus==="REJECTED") message = "Registration rejected by the organizer.";
  if (r.registrationStatus==="DISQUALIFIED") message = "Registration/team has been disqualified.";
  return json({registrationId:r.registrationId,teamName:r.teamName,paymentStatus:r.paymentStatus,registrationStatus:r.registrationStatus,message});
};
