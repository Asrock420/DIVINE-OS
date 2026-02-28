// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbxQvblN6hoWOTQRK6MQ7To0xeqVjvN3NX8NWRM6eHmjkDHVhoWM9ABMd52Jy0ysgcIz/exec";

let CURRENT_USER = null;

// 🛡️ THE MASTER PERMISSION MATRIX (RBAC)
const PERMISSIONS = {
    "Executive Management": ["dashboard", "crm", "bookings", "finance", "commission", "hr", "admin"],
    "System Control": ["dashboard", "crm", "bookings", "finance", "commission", "hr", "admin"],
    "Sales Department": ["dashboard", "crm", "bookings", "commission"],
    "CR & Accounts": ["dashboard", "bookings", "finance", "commission", "hr"],
    "Admin & HR Logistic": ["dashboard", "hr", "admin"],
    "Marketing Department": ["dashboard", "marketing"],
    "Operations": ["dashboard", "operations"],
    "Office Support": ["dashboard", "hr"] // 👈 এখানে "hr" (Requisition) যোগ করা হয়েছে
};

// 🏷️ MENU LABELS
const TAB_NAMES = {
    "dashboard": "📊 Home",
    "crm": "👥 Leads (CRM)",
    "bookings": "📝 Bookings",
    "finance": "💰 Installments",
    "commission": "💸 Commissions",
    "hr": "🧾 Requisitions & HR",
    "marketing": "📢 Marketing",
    "operations": "🏗️ Operations",
    "admin": "⚙️ Admin Control"
};

function showToast(msg) { 
    var x = document.getElementById("toast"); 
    x.innerText = msg; x.style.visibility = "visible"; 
    setTimeout(() => { x.style.visibility = "hidden"; }, 6000); 
}

async function apiCall(action, payload = {}) {
    payload.action = action;
    try {
        const response = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();
        if(result.status === 'success') return result.data;
        else { alert("Error: " + result.message); return null; }
    } catch (err) { alert("Network Error"); return null; }
}

// ----------------------------------------------------
// LOGIN & ROUTING LOGIC
// ----------------------------------------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loginBtn').innerText = "Authenticating...";
        const phone = document.getElementById('p').value;
        const pass = document.getElementById('x').value;
        
        const res = await apiCall('login', { phone, pass });
        if (res && res.success) {
            localStorage.setItem('divineUser', JSON.stringify(res));
            window.location.href = 'dashboard.html';
        } else {
            alert("❌ Wrong Credentials or Blocked!");
            document.getElementById('loginBtn').innerText = "Secure Login";
        }
    });
}

function logout() { localStorage.removeItem('divineUser'); window.location.href = 'index.html'; }

function initERP() {
    CURRENT_USER = JSON.parse(localStorage.getItem('divineUser'));
    if (!CURRENT_USER) { window.location.href = 'index.html'; return; }
    
    // Setup Header
    document.getElementById('erpHeader').style.display = "flex";
    document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
    
    // Show Visit button only for Sales
    if(CURRENT_USER.department === 'Sales Department') {
        document.getElementById('offBtn').style.display = "block";
    }

    renderNav(CURRENT_USER.department);
    switchTab('dashboard'); // Default load
}

function renderNav(department) {
    const allowedModules = PERMISSIONS[department] || ["dashboard"];
    const navBar = document.getElementById('navBar');
    navBar.style.display = "flex";
    navBar.innerHTML = "";

    allowedModules.forEach(mod => {
        let btn = document.createElement("button");
        btn.className = "nav-btn";
        btn.id = `nav-${mod}`;
        btn.innerText = TAB_NAMES[mod] || mod;
        btn.onclick = () => switchTab(mod);
        navBar.appendChild(btn);
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let activeBtn = document.getElementById(`nav-${tabId}`);
    if(activeBtn) activeBtn.classList.add('active');

    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h3 style="text-align:center; padding:30px; color:#0f4c3a;">Loading ${TAB_NAMES[tabId]}...</h3>`;

    if(tabId === 'dashboard') loadDashboardTab();
    else if(tabId === 'crm') loadCRMTab();
    else if(tabId === 'admin') loadAdminTab();
    else if(tabId === 'bookings') loadComingSoonTab("Bookings");
    else if(tabId === 'finance') loadComingSoonTab("Installments");
    else if(tabId === 'commission') loadComingSoonTab("Commissions");
    else if(tabId === 'hr') loadComingSoonTab("Requisitions & HR");
    else loadComingSoonTab(tabId);
}

// ----------------------------------------------------
// TAB RENDERERS
// ----------------------------------------------------

async function loadDashboardTab() {
    const appDiv = document.getElementById('app');
    let html = `
      <div class="card" style="text-align:center;">
        <h2 class="header-title">Welcome to Divine OS, ${CURRENT_USER.name}!</h2>
        <p style="color:#666;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
      </div>
      <div class="pie-container">
        <div class="stat-box"><div class="stat-num" style="color:#0d6efd">--</div>Total Tasks</div>
        <div class="stat-box"><div class="stat-num" style="color:#198754">--</div>Completed</div>
        <div class="stat-box"><div class="stat-num" style="color:#dc3545">--</div>Pending</div>
      </div>
    `;
    appDiv.innerHTML = html;
}

function loadComingSoonTab(moduleName) {
    document.getElementById('app').innerHTML = `
      <div class="card" style="text-align:center; padding: 50px;">
        <h2 style="color:#f39c12; font-size:40px; margin:0;">🚧</h2>
        <h3 class="header-title">${moduleName} Module</h3>
        <p>This module is currently under development. Stay tuned!</p>
      </div>
    `;
}

async function loadCRMTab() {
    const appDiv = document.getElementById('app');
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        const rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
        if(rawData) renderAdminCRM(JSON.parse(rawData));
    } else {
        const rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
        if(rawData) renderSalesCRM(JSON.parse(rawData));
    }
}

async function loadAdminTab() {
    const rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
    if(!rawData) return;
    const data = JSON.parse(rawData);

    let html = `
      <div class="card" style="background: linear-gradient(to right, #f1c40f, #f39c12); border: none;">
         <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; color:#0f4c3a;">🌴 Global Holiday Mode</h3>
            <button id="holBtn" class="btn ${data.holiday ? 'btn-red' : 'btn-green'}" onclick="toggleHoliday()">${data.holiday ? 'ON (Sleeping)' : 'OFF (Active)'}</button>
         </div>
      </div>

      <div class="card"><h3 class="header-title">🚀 Manual Lead Assignment</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input id="cName" placeholder="Client Name" style="flex:1">
          <input id="cPhone" placeholder="Phone" style="flex:1">
          <select id="cProd" style="flex:1"><option value="Cox Hotel">🏨 Cox Hotel</option><option value="Purbachal Land">🏠 Purbachal Land</option><option value="Commercial Space">🏢 Commercial Space</option></select>
          <select id="cAgent" style="flex:1"><option value="Round Robin">Round Robin</option></select>
          <button class="btn btn-green" onclick="addLead()">Assign Lead</button>
        </div>
      </div>
      
      <div class="card"><h3 class="header-title">👮 Agent Status (Access Control)</h3><div id="agents">Loading...</div></div>
    `;
    document.getElementById('app').innerHTML = html;

    // Render Agents list
    let cAgentOpts = '<option value="Round Robin">🔄 Round Robin</option>';
    let agHtml = '<table><tr><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Action</th></tr>';
    
    data.team.forEach(a => {
        cAgentOpts += `<option value="${a.name}">${a.name}</option>`;
        let isChecked = (a.status === 'Active' || a.status === 'Visit') ? 'checked' : '';
        let statusText = (a.status === 'Visit' || a.status === 'Offline') ? '🚶 On Visit' : a.status;
        agHtml += `<tr><td><b>${a.name}</b></td><td><small>${a.dept}</small></td><td><small>${a.role}</small></td><td><b>${statusText}</b></td><td><label class="switch"><input type="checkbox" ${isChecked} onchange="toggleAgent('${a.name}')"><span class="slider"></span></label></td></tr>`;
    });
    agHtml += '</table>';
    
    document.getElementById('agents').innerHTML = agHtml;
    document.getElementById('cAgent').innerHTML = cAgentOpts;
}

// --- CRM RENDERERS ---
function renderSalesCRM(data) {
    if(data.status === 'Blocked') { document.getElementById('app').innerHTML = '<h2 style="color:red;text-align:center;">🚫 BLOCKED</h2>'; return; }
    
    let html = `<div class="card desktop-table"><table><thead><tr><th>Client</th><th>Phone</th><th>Status</th><th>Elapsed Time</th><th>ERP ID</th><th>Action</th></tr></thead><tbody>`;
    data.leads.forEach(l => {
      let timeHtml = l.status !== 'New' ? '<span style="color:#198754">✓ Handled</span>' : `<span class="timer" data-start="${l.assignTime}">Counting...</span>`;
      html += `<tr><td><b>${l.name}</b><br><small>${l.product}</small></td><td>${l.phone}</td><td><span class="badge st-con">${l.status}</span></td><td>${timeHtml}</td><td>${l.erp}</td><td><button class="btn btn-blue" onclick="openModal('${l.id}')">Update</button></td></tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('app').innerHTML = html;
    startTimers();
}

function renderAdminCRM(data) {
    let stHtml = '<div class="card"><h3 class="header-title">📊 Team CRM Performance</h3><table class="stats-table"><thead><tr><th>Agent</th><th>Total Leads</th><th>New</th><th>Contacted</th><th>Sold</th><th>Reject</th></tr></thead><tbody>';
    for(let ag in data.stats) {
        let s = data.stats[ag];
        stHtml += `<tr><td><b>${ag}</b></td><td>${s.total}</td><td>${s.new}</td><td>${s.contacted}</td><td><b style="color:green">${s.sold}</b></td><td><b style="color:red">${s.reject}</b></td></tr>`;
    }
    stHtml += '</tbody></table></div>';
    
    // Rejected Leads Re-assign UI
    stHtml += `<div class="card"><h3 class="header-title">♻️ Rejected Leads Re-assign</h3><div style="max-height:300px; overflow-y:auto;"><table class="data-table"><thead><tr><th>Name</th><th>Phone</th><th>Old Agent</th><th>Re-assign To</th></tr></thead><tbody>`;
    if(data.rejected.length > 0) {
        let teamOpts = '<option value="">Select Agent...</option>';
        data.team.forEach(a => { teamOpts += `<option value="${a.name}">${a.name}</option>`; });
        data.rejected.forEach(r => { stHtml += `<tr><td>${r.name}</td><td>${r.phone}</td><td>${r.oldAgent}</td><td><div style="display:flex; gap:5px;"><select id="re_${r.id}">${teamOpts}</select><button class="btn btn-blue btn-sm" onclick="reassign('${r.id}')">Go</button></div></td></tr>`; });
    } else { stHtml += `<tr><td colspan="4" style="text-align:center;">✅ No rejected leads found.</td></tr>`; }
    stHtml += `</tbody></table></div></div>`;
    
    document.getElementById('app').innerHTML = stHtml;
}

// --- ACTIONS ---
async function goVisit() {
    const res = await apiCall('toggleSalesmanStatus', { user: CURRENT_USER.name });
    if(res === 'Visit') {
        document.getElementById('offBtn').innerText = "Return from Visit"; document.getElementById('offBtn').className = "btn btn-green";
        document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role} (🚶 Visit)`;
        showToast("You are on VISIT.");
    } else {
        document.getElementById('offBtn').innerText = "Go Visit"; document.getElementById('offBtn').className = "btn btn-gold";
        document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
        showToast("Welcome Back! You are ACTIVE.");
    }
}

async function toggleAgent(name) { 
    const res = await apiCall('toggleAgentStatus', { name: name });
    showToast(res); loadAdminTab(); 
}

async function toggleHoliday() {
    if(confirm("Toggle Global Holiday Mode?")) {
        const res = await apiCall('toggleHolidayMode');
        let btn = document.getElementById('holBtn');
        btn.innerText = (res === "ON" ? "ON (Sleeping)" : "OFF (Active)");
        btn.className = (res === "ON" ? "btn btn-red" : "btn btn-green");
    }
}

async function addLead() {
    let p = { name: document.getElementById('cName').value, phone: document.getElementById('cPhone').value, product: document.getElementById('cProd').value, agent: document.getElementById('cAgent').value };
    if(!p.phone) return alert("Phone required!");
    const res = await apiCall('adminManualEntry', { data: p });
    showToast(res); loadAdminTab();
}

async function reassign(id) {
    let agent = document.getElementById('re_'+id).value;
    if(!agent) return alert("Select an agent");
    const res = await apiCall('adminReassignLead', { id: id, agent: agent });
    showToast("Reassigned Successfully!"); loadCRMTab();
}

// --- MODALS & TIMERS ---
async function openModal(id) {
    document.getElementById('lid').value = id;
    document.getElementById('modal').style.display = 'block';
    const h = await apiCall('getHistory', { id: id });
    if(h) document.getElementById('his').innerHTML = h.map(x => `<b>${x.date}</b>: ${x.status} - ${x.note}`).join('<br>');
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }

async function saveLead() {
    let p = { id: document.getElementById('lid').value, agent: CURRENT_USER.name, stage: document.getElementById('st').value, erpId: document.getElementById('erp').value };
    if(p.stage === 'Contacted' && !p.erpId) return alert("❌ ERP ID is Required!");
    document.querySelector('#modal button').innerText = "Saving...";
    const res = await apiCall('processLeadUpdate', { data: p }); 
    showToast(res); closeModal(); loadCRMTab();
}

let timerInterval;
function startTimers() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let now = new Date().getTime();
        document.querySelectorAll('.timer').forEach(t => {
            let start = parseInt(t.getAttribute('data-start'));
            let diff = now - start;
            let h = Math.floor(diff / 3600000);
            let m = Math.floor((diff % 3600000) / 60000);
            t.innerText = h + "h " + m + "m ago";
        });
    }, 1000); 
}