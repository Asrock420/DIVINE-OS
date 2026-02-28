// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbyMnUwXMqHfDIG6ValJdhy1xR0xSK9oYfGObL1M4Nus7hNJpvXoq4AjxXiOSVrmXYG4/exec";

let USER = "";
let timerInterval;
let prayerTimes = {};
let playedPrayers = {};

// Helper: Show Toast
function showToast(msg) { 
    var x = document.getElementById("toast"); 
    x.innerText = msg; 
    x.style.visibility = "visible"; 
    setTimeout(() => { x.style.visibility = "hidden"; }, 6000); 
}

// Helper: API Fetch call
async function apiCall(action, payload = {}) {
    payload.action = action;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if(result.status === 'success') return result.data;
        else { alert("Error: " + result.message); return null; }
    } catch (err) {
        alert("Network Error: Please check your connection.");
        return null;
    }
}

// ----------------------------------------------------
// LOGIN LOGIC (index.html)
// ----------------------------------------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginBtn');
        btn.innerText = "Checking...";
        const phone = document.getElementById('p').value;
        const pass = document.getElementById('x').value;
        
        const res = await apiCall('login', { phone, pass });
        if (res && res.success) {
            localStorage.setItem('divineUser', JSON.stringify({name: res.name, role: res.role}));
            window.location.href = 'dashboard.html';
        } else {
            alert("❌ Wrong Credentials");
            btn.innerText = "Secure Login";
        }
    });
}

function logout() {
    localStorage.removeItem('divineUser');
    window.location.href = 'index.html';
}

// ----------------------------------------------------
// SALESMAN DASHBOARD LOGIC
// ----------------------------------------------------
async function loadSalesmanDashboard(userName) {
    USER = userName;
    const rawData = await apiCall('getSalesmanData', { user: USER });
    if(!rawData) return;
    const data = JSON.parse(rawData);
    prayerTimes = data.prayers; 
    
    if(data.status === 'Blocked') { 
        document.getElementById('app').innerHTML = '<div class="blocked-screen"><h1>🚫 BLOCKED!</h1><p>You have been manually blocked.<br>Contact Admin to Unblock.</p><button class="btn btn-red" onclick="logout()" style="margin-top:20px;">Logout</button></div>'; return; 
    }

    let holidayHtml = data.holiday ? '<div class="ramadan-banner">🌴 Holiday Mode is ON. Office is closed today!</div>' : '';
    
    let html = '<div class="container">' + holidayHtml + 
               '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:15px;">' +
               '<div><h2 class="header-title" style="margin:0;">👋 '+USER+'</h2><span id="uStatus" class="badge '+(data.status==='Visit'?'st-visit':'st-con')+'" style="font-size:13px;">'+data.status+'</span></div>' +
               '<div style="display:flex; gap:10px;"><button id="offBtn" class="btn '+(data.status==='Visit'?'btn-green':'btn-gold')+'" onclick="goVisit()">'+(data.status==='Visit'?'Return from Visit':'Go Visit')+'</button><button class="btn btn-red" onclick="logout()">Logout</button></div></div>';
    
    html += '<div class="card desktop-table"><table><thead><tr><th>Client/Lead</th><th>Phone</th><th>Status</th><th>Elapsed Time</th><th>ERP ID</th><th>Action</th></tr></thead><tbody>';
    
    data.leads.forEach(l => {
      let badge = getBadge(l.product);
      let timeHtml = getTimerHtml(l.assignTime, l.status);
      html += '<tr><td>'+badge+' <br><b>'+l.name+'</b></td><td>'+l.phone+'</td><td><span class="badge st-'+(l.status=='New'?'new':'con')+'">'+l.status+'</span></td><td>'+timeHtml+'</td><td>'+l.erp+'</td><td><button class="btn btn-blue" onclick="openModal(\\''+l.id+'\\')">Update</button></td></tr>';
    });
    html += '</tbody></table></div>';
    
    data.leads.forEach(l => {
      let badge = getBadge(l.product);
      let timeHtml = getTimerHtml(l.assignTime, l.status);
      html += '<div class="card mobile-card"><div style="display:flex; justify-content:space-between;"><div>'+badge+' <b>'+l.name+'</b></div><span class="badge st-'+(l.status=='New'?'new':'con')+'">'+l.status+'</span></div><p style="margin:5px 0;">📞 '+l.phone+'</p><p style="margin:5px 0;">⏳ '+timeHtml+'</p><button class="btn btn-blue" style="width:100%; margin-top:10px;" onclick="openModal(\\''+l.id+'\\')">Update Status</button></div>';
    });
    html += '</div>';
    
    html += '<div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"><div class="card" style="margin:50px auto; max-width:500px; max-height:80vh; overflow-y:auto; border-top: 4px solid #f1c40f;"><h3 class="header-title">Update Lead</h3><input type="hidden" id="lid"><label>Status</label><select id="st"><option>Contacted</option><option>Sold</option><option>Reject</option></select><div id="erpBox"><label>ERP ID (Mandatory for Deal)</label><input id="erp" placeholder="Enter ERP ID"></div><button class="btn btn-green" style="width:100%; margin-bottom:10px;" onclick="saveLead()">Save Update</button> <button class="btn btn-red" style="width:100%;" onclick="closeModal()">Close</button><div style="margin-top:15px; background:#f4f6f8; padding:10px; font-size:12px; border-radius:5px;" id="his">Loading history...</div></div></div>';
    
    document.getElementById('app').innerHTML = html;
    startTimers();
}

async function goVisit() {
    const res = await apiCall('toggleSalesmanStatus', { user: USER });
    if(res === 'Visit') {
        document.getElementById('offBtn').innerText = "Return from Visit";
        document.getElementById('offBtn').className = "btn btn-green";
        document.getElementById('uStatus').innerText = "Visit";
        document.getElementById('uStatus').className = "badge st-visit";
        showToast("You are on VISIT. No new leads will be assigned.");
    } else if (res === 'Active') {
        document.getElementById('offBtn').innerText = "Go Visit";
        document.getElementById('offBtn').className = "btn btn-gold";
        document.getElementById('uStatus').innerText = "Active";
        document.getElementById('uStatus').className = "badge st-con";
        showToast("Welcome Back! You are ACTIVE.");
    } else { alert(res); }
}

function getBadge(p) {
    if(!p) return '<span class="badge bg-gen">General</span>';
    if(p.includes('Cox')) return '<span class="badge bg-cox">🏨 Cox</span>';
    if(p.includes('Land')) return '<span class="badge bg-land">🏠 Land</span>';
    if(p.includes('Comm')) return '<span class="badge bg-comm">🏢 Space</span>';
    return '<span class="badge bg-gen">'+p+'</span>';
}

function getTimerHtml(startTime, status) {
    if(status !== 'New') return '<span style="color:#198754">✓ Handled</span>';
    return '<span class="timer" data-start="'+startTime+'">Counting...</span>';
}

function checkPrayerTime() {
    if(!prayerTimes) return;
    let now = new Date();
    let currentTime = now.getHours() * 60 + now.getMinutes();
    ['Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
        if(prayerTimes[p]) {
            let pt = prayerTimes[p].split(':');
            let pTime = parseInt(pt[0]) * 60 + parseInt(pt[1]);
            if(currentTime === pTime && !playedPrayers[p]) {
                playedPrayers[p] = true;
                try { document.getElementById('azaanAudio').play(); } catch(e) { console.log("Azaan play blocked by browser."); }
                showToast("🕌 " + p + " নামাজের সময় হয়েছে!");
            }
        }
    });
}

function startTimers() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let now = new Date().getTime();
        checkPrayerTime(); 
        document.querySelectorAll('.timer').forEach(t => {
            let start = parseInt(t.getAttribute('data-start'));
            let diff = now - start;
            let h = Math.floor(diff / 3600000);
            let m = Math.floor((diff % 3600000) / 60000);
            t.innerText = h + "h " + m + "m ago";
        });
    }, 1000); 
}

async function openModal(id) {
    document.getElementById('lid').value = id;
    document.getElementById('modal').style.display = 'block';
    const h = await apiCall('getHistory', { id: id });
    if(h) document.getElementById('his').innerHTML = h.map(x => '<b>'+x.date+'</b>: '+x.status+' - '+x.note).join('<br>');
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }

async function saveLead() {
    let p = { id: document.getElementById('lid').value, agent: USER, stage: document.getElementById('st').value, erpId: document.getElementById('erp').value };
    if(p.stage === 'Contacted' && !p.erpId) return alert("❌ ERP ID is Required!");
    document.querySelector('#modal button').innerText = "Saving...";
    const res = await apiCall('processLeadUpdate', { data: p });
    alert(res);
    closeModal();
    loadSalesmanDashboard(USER);
}

// ----------------------------------------------------
// ADMIN / BOSS DASHBOARD LOGIC
// ----------------------------------------------------
let CURRENT_ROLE = "";
async function loadAdminDashboard(userName, role) {
    USER = userName;
    CURRENT_ROLE = role;
    
    let html = `<div class="container">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 class="header-title">👑 ${role === 'Boss' ? 'CEO Dashboard' : 'Admin Control'}</h2>
        <button class="btn btn-red" onclick="logout()">Logout</button>
      </div>
      <div class="card" style="background: linear-gradient(to right, #f1c40f, #f39c12); border: none;">
         <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; color:#0f4c3a;">🌴 Holiday / Emergency Mode</h3>
            <button id="holBtn" class="btn btn-green" style="box-shadow:0 2px 5px rgba(0,0,0,0.2);" onclick="toggleHoliday()">Loading...</button>
         </div>
         <p style="font-size:12px; color:#0f4c3a; margin-top:5px; margin-bottom:0;">Turn ON to display holiday banner on dashboards.</p>
      </div>`;

    if(role === 'Boss') {
      html += `<div class="card"><h3 class="header-title">📈 Product Overview</h3><div class="pie-container" id="prodStats">Loading...</div></div>
      <div class="card"><h3 class="header-title">📊 Team Performance</h3><div id="statsBoard">Loading...</div></div>
      <div class="card"><h3 class="header-title">🚫 Blocked Agents Management</h3><table class="data-table"><thead><tr><th>Name</th><th>Cause</th><th>Action</th></tr></thead><tbody id="blockedBody"></tbody></table></div>`;
    } else {
      html += `<div class="card"><h3 class="header-title">📊 Team Performance</h3><div id="statsBoard">Loading...</div></div>
      <div class="card"><h3 class="header-title">🚀 Manual Lead Entry</h3><div style="display:flex; gap:10px; flex-wrap:wrap;"><input id="cName" placeholder="Client Name" style="flex:1"><input id="cPhone" placeholder="Phone" style="flex:1"><select id="cProd" style="flex:1"><option value="Cox Hotel">🏨 Cox Hotel</option><option value="Purbachal Land">🏠 Purbachal Land</option><option value="Commercial Space">🏢 Commercial Space</option></select><select id="cAgent" style="flex:1"><option value="Round Robin">Round Robin</option></select><button class="btn btn-green" onclick="addLead()">Assign Lead</button></div></div>
      <div class="card"><h3 class="header-title">♻️ Rejected Leads Re-assign</h3><div style="max-height:300px; overflow-y:auto;"><table class="data-table"><thead><tr><th>Name</th><th>Phone</th><th>Old Agent</th><th>Re-assign To</th></tr></thead><tbody id="rejBody"></tbody></table></div></div>
      <div class="card"><h3 class="header-title">👮 Agent Status (Manual Block)</h3><div id="agents">Loading...</div></div>
      <div class="card"><h3 class="header-title">🖨️ PDF Reports</h3><div style="display:flex; gap:10px; flex-wrap:wrap;"><select id="repAgent" style="flex:1; min-width:150px;"><option>All Agents</option></select><select id="repTime" style="flex:1; min-width:150px;"><option>Last 24 Hours</option><option>This Week</option><option>This Month</option><option>All Time</option></select><button class="btn btn-gold" onclick="printReport()" style="flex:1; min-width:150px;">Download PDF</button></div></div>`;
    }
    html += `</div>`;
    document.getElementById('app').innerHTML = html;

    // Fetch and populate Data
    const rawData = await apiCall('getAdminData', { role: CURRENT_ROLE });
    if(!rawData) return;
    const data = JSON.parse(rawData);

    let btn = document.getElementById('holBtn');
    btn.innerText = "STATUS: " + (data.holiday ? "ON" : "OFF");
    btn.className = data.holiday ? "btn btn-red" : "btn btn-green";

    if(CURRENT_ROLE === 'Boss') {
        let p = data.products;
        document.getElementById('prodStats').innerHTML = '<div class="stat-box"><div class="stat-num" style="color:#6f42c1">'+p['Cox Hotel']+'</div>🏨 Cox Hotel</div><div class="stat-box"><div class="stat-num" style="color:#198754">'+p['Land']+'</div>🏠 Land</div><div class="stat-box"><div class="stat-num" style="color:#0d6efd">'+p['Commercial']+'</div>🏢 Commercial</div>';
        
        let bHtml = '';
        if(data.blocked.length > 0) {
            data.blocked.forEach(b => { bHtml += '<tr><td>'+b.name+'</td><td style="color:red;">'+b.reason+'</td><td><button class="btn btn-green btn-sm" onclick="ceoUnlock(\\''+b.name+'\\')">Unlock</button></td></tr>'; });
        } else { bHtml = '<tr><td colspan="3">No blocked agents.</td></tr>'; }
        document.getElementById('blockedBody').innerHTML = bHtml;
    }

    let stHtml = '<table class="stats-table"><thead><tr><th>Agent</th><th>Total</th><th>New</th><th>Contacted</th><th>Sold</th><th>Reject</th></tr></thead><tbody>';
    for(let ag in data.stats) {
        let s = data.stats[ag];
        stHtml += '<tr><td><b>'+ag+'</b></td><td>'+s.total+'</td><td>'+s.new+'</td><td>'+s.contacted+'</td><td>'+s.sold+'</td><td>'+s.reject+'</td></tr>';
    }
    stHtml += '</tbody></table>';
    document.getElementById('statsBoard').innerHTML = stHtml;

    if(CURRENT_ROLE !== 'Boss') {
        let rHtml = ''; let teamOpts = '<option value="">Select Agent...</option>'; let cAgentOpts = '<option value="Round Robin">🔄 Round Robin</option>'; let repOpts = '<option>All Agents</option>';
        data.team.forEach(a => { teamOpts += '<option value="'+a.name+'">'+a.name+'</option>'; cAgentOpts += '<option value="'+a.name+'">'+a.name+'</option>'; repOpts += '<option value="'+a.name+'">'+a.name+'</option>'; });

        if(data.rejected.length > 0) {
            data.rejected.forEach(r => { rHtml += '<tr><td>'+r.name+'</td><td>'+r.phone+'</td><td>'+r.oldAgent+'</td><td><div style="display:flex; gap:5px;"><select id="re_'+r.id+'">'+teamOpts+'</select><button class="btn btn-blue btn-sm" onclick="reassign(\\''+r.id+'\\')">Go</button></div></td></tr>'; });
        } else { rHtml = '<tr><td colspan="4" style="text-align:center;">✅ No rejected leads found.</td></tr>'; }
        document.getElementById('rejBody').innerHTML = rHtml;

        let agHtml = '<table><tr><th>Name</th><th>Status</th><th>Action</th></tr>';
        data.team.forEach(a => {
            let isChecked = (a.status === 'Active' || a.status === 'Visit') ? 'checked' : '';
            let statusText = (a.status === 'Visit' || a.status === 'Offline') ? '🚶 On Visit' : a.status;
            agHtml += '<tr><td>'+a.name+'</td><td><b>'+statusText+'</b></td><td><label class="switch"><input type="checkbox" '+isChecked+' onchange="toggleAgent(\\''+a.name+'\\')"><span class="slider"></span></label></td></tr>';
        });
        agHtml += '</table>';
        document.getElementById('agents').innerHTML = agHtml;
        document.getElementById('cAgent').innerHTML = cAgentOpts;
        document.getElementById('repAgent').innerHTML = repOpts;
    }
}

async function toggleAgent(name) { 
    const res = await apiCall('toggleAgentStatus', { name: name });
    alert(res); loadAdminDashboard(USER, CURRENT_ROLE); 
}
async function toggleHoliday() {
    if(confirm("Toggle Holiday/Emergency Mode?")) {
        const res = await apiCall('toggleHolidayMode');
        let btn = document.getElementById('holBtn');
        btn.innerText = "STATUS: " + (res === "ON" ? "ON" : "OFF");
        btn.className = res === "ON" ? "btn btn-red" : "btn btn-green";
    }
}
async function addLead() {
    let p = { name: document.getElementById('cName').value, phone: document.getElementById('cPhone').value, product: document.getElementById('cProd').value, agent: document.getElementById('cAgent').value };
    if(!p.phone) return alert("Phone required!");
    const res = await apiCall('adminManualEntry', { data: p });
    alert(res); document.getElementById('cName').value = ""; document.getElementById('cPhone').value = ""; loadAdminDashboard(USER, CURRENT_ROLE);
}
async function reassign(id) {
    let agent = document.getElementById('re_'+id).value;
    if(!agent) return alert("Select an agent");
    const res = await apiCall('adminReassignLead', { id: id, agent: agent });
    alert(res); loadAdminDashboard(USER, CURRENT_ROLE);
}
async function ceoUnlock(name) {
    if(confirm("Unlock "+name+"?")) {
        const res = await apiCall('ceoUnblock', { name: name });
        alert(res); loadAdminDashboard(USER, CURRENT_ROLE);
    }
}
async function printReport() {
    let agent = document.getElementById('repAgent').value;
    let time = document.getElementById('repTime').value;
    const html = await apiCall('generateReportHTML', { agent: agent, time: time });
    let win = window.open('', '', 'height=700,width=900'); win.document.write(html); win.document.close(); win.print();
}