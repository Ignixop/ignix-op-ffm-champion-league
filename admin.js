let token = sessionStorage.getItem("ignix_admin_token") || "";
const $ = (s) => document.querySelector(s);

async function api(path, opts={}) {
  opts.headers = {...(opts.headers||{}), "Authorization": `Bearer ${token}`, "Content-Type":"application/json"};
  const r = await fetch(`/.netlify/functions/${path}`, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}

function showDash() {
  $("#loginBox").hidden = true; $("#dashboard").hidden = false; refresh();
}

$("#loginBtn").onclick = async () => {
  $("#loginStatus").textContent = "Checking…";
  try {
    const d = await fetch("/.netlify/functions/admin-login", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({password:$("#adminPassword").value})
    }).then(async r => { const x=await r.json(); if(!r.ok) throw new Error(x.error||"Login failed"); return x; });
    token = d.token; sessionStorage.setItem("ignix_admin_token", token); showDash();
  } catch(e) { $("#loginStatus").textContent = e.message; }
};

$("#logoutBtn").onclick = () => { sessionStorage.removeItem("ignix_admin_token"); location.reload(); };
$("#refreshBtn").onclick = refresh;

async function refresh() {
  try {
    const d = await api("admin-data");
    $("#adminStats").innerHTML = `
      <div><b>${d.stats.total}</b><span>REGISTRATIONS</span></div>
      <div><b>${d.stats.paid}</b><span>PAID / RESERVED</span></div>
      <div><b>${d.stats.pending}</b><span>PENDING</span></div>
      <div><b>${Math.max(0,12-d.stats.paid)}</b><span>SLOTS LEFT</span></div>`;
    $("#regTable tbody").innerHTML = d.registrations.map(x => `
      <tr>
        <td><b>${x.registrationId}</b><br><small>${new Date(x.createdAt).toLocaleString()}</small></td>
        <td>${escapeHtml(x.teamName)}</td>
        <td>${escapeHtml(x.captainName)}<br>${escapeHtml(x.phone)}</td>
        <td>${x.players.map((p,i)=>`${i+1}. ${escapeHtml(p.name)} — ${escapeHtml(p.uid)}`).join("<br>")}</td>
        <td><b>${x.paymentStatus}</b><br><small>Code: ${escapeHtml(x.registrationCode || "-")}</small></td>
        <td>${x.registrationStatus}</td>
        <td><select onchange="changeStatus('${x.registrationId}',this.value)">
          ${["REGISTERED","CONFIRMED","REJECTED","DISQUALIFIED"].map(s=>`<option ${s===x.registrationStatus?"selected":""}>${s}</option>`).join("")}
        </select></td>
      </tr>`).join("");
    const teams = d.registrations.filter(x => x.paymentStatus==="PAID" && x.registrationStatus!=="REJECTED");
    $("#standingsTable tbody").innerHTML = teams.slice(0,6).map((x,i)=>`
      <tr data-id="${x.registrationId}">
        <td>${i+1}</td><td>${escapeHtml(x.teamName)}</td>
        <td><input class="spoints" type="number" min="0" value="${x.finalPoints||0}"></td>
        <td><input class="skills" type="number" min="0" value="${x.finalKills||0}"></td>
      </tr>`).join("");
  } catch(e) { if(e.message.includes("Unauthorized")) { sessionStorage.removeItem("ignix_admin_token"); location.reload(); } else alert(e.message); }
}

window.changeStatus = async (id, status) => {
  try { await api("admin-update", {method:"POST", body:JSON.stringify({id, status})}); refresh(); }
  catch(e){ alert(e.message); refresh(); }
};

$("#saveStandings").onclick = async () => {
  const rows = [...document.querySelectorAll("#standingsTable tbody tr")];
  const standings = rows.map(r => ({registrationId:r.dataset.id, points:+r.querySelector(".spoints").value, kills:+r.querySelector(".skills").value}));
  try { await api("admin-standings",{method:"POST",body:JSON.stringify({standings})}); $("#standingsStatus").textContent="Standings saved."; }
  catch(e){ $("#standingsStatus").textContent=e.message; }
};

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

if(token) showDash();
