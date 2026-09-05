const $ = (s) => document.querySelector(s);

async function loadSlots() {
  try {
    const r = await fetch("/.netlify/functions/public-data");
    const data = await r.json();
    const used = data.paidOrReserved;
    const total = 12;
    const left = Math.max(0, total - used);
    $("#slotCount").textContent = `${left} / ${total}`;
    $("#slotBar").style.width = `${Math.min(100, used / total * 100)}%`;
    $("#slotMessage").textContent = left ? `${left} registration slot${left === 1 ? "" : "s"} remaining.` : "Registration is full.";
    if (!left) {
      $("#verifyBtn").disabled = true;
      $("#submitBtn").disabled = true;
    }
  } catch {
    $("#slotMessage").textContent = "Unable to check slots. Try again.";
  }
}

$("#codeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#verifyBtn"), status = $("#codeStatus");
  const input = $("#registrationCode");
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  btn.disabled = true;
  status.textContent = "Verifying code…";
  try {
    const r = await fetch("/.netlify/functions/verify-code", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({registrationCode: code})
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Code verification failed.");

    $("#verifiedRegistrationCode").value = code;
    $("#verifiedCodeLabel").textContent = code;
    $("#codeGate").hidden = true;
    $("#registrationFormWrap").hidden = false;
    status.textContent = "";
    $("#registrationFormWrap").scrollIntoView({behavior:"smooth", block:"start"});
  } catch (err) {
    status.textContent = err.message;
    btn.disabled = false;
  }
});

$("#registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#submitBtn"), status = $("#formStatus");
  btn.disabled = true;
  status.textContent = "Checking your registration code and submitting your squad…";
  const form = new FormData(e.currentTarget);
  const payload = Object.fromEntries(form.entries());
  try {
    const r = await fetch("/.netlify/functions/register", {
      method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Registration failed.");
    status.innerHTML = `Registration submitted successfully. Your Registration ID is <b>${data.registrationId}</b>. Save it and contact IGNIX OP if you need help.`;
    e.currentTarget.reset();
    loadSlots();
  } catch (err) {
    status.textContent = err.message;
    btn.disabled = false;
    loadSlots();
  }
});

loadSlots();
