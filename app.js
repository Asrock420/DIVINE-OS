// ✅ তোমার Google Script Web App URL বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbxQvblN6hoWOTQRK6MQ7To0xeqVjvN3NX8NWRM6eHmjkDHVhoWM9ABMd52Jy0ysgcIz/exec";

let CURRENT_USER = null;

// The Master Permission Matrix (RBAC)
const PERMISSIONS = {
    "Executive Management": ["dashboard", "crm", "finance", "hr", "admin"],
    "System Control": ["dashboard", "crm", "finance", "hr", "admin"],
    "Sales Department": ["dashboard", "crm", "commission"],
    "CR & Accounts": ["dashboard", "finance", "commission"],
    "Admin & HR Logistic": ["dashboard", "hr"],
    "Marketing Department": ["dashboard", "marketing"],
    "Operations": ["dashboard", "operations"],
    "Office Support": ["dashboard"]
};

// Dependent Roles Mapping (For Admin User Creation Form)
const ROLE_MAPPING = {
    "Executive Management": ["CEO", "Managing Director", "Director"],
    "Sales Department": ["Sales Executive", "Senior Sales Executive", "Sales Manager", "Team Leader"],
    "Marketing Department": ["Digital Marketing Executive", "Media Buyer", "Content Creator", "Motion & Graphic Designer", "Campaign Manager"],
    "CR & Accounts": ["Accounts Officer", "CR Executive", "Collection Officer", "Finance Manager"],
    "Admin & HR Logistic": ["HR Officer", "Admin Executive", "Office Manager", "Logistic Officer"],
    "Operations": ["Project Coordinator", "Site Engineer", "Construction Supervisor"],
    "System Control": ["Chief System Architect", "ERP Developer", "IT Admin"],
    "Office Support": ["Office Assistant", "Front Desk", "Data Entry Operator"]
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

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loginBtn').innerText = "Authenticating...";
        const phone = document.getElementById('p').value;
        const pass = document.getElementById('x').value;
        
        const res = await apiCall('login', { phone, pass });
        if (res && res.success) {
            localStorage.setItem('divineUser', JSON.stringify(res)); // Contains name, dept, role, status
            window.location.href = 'dashboard.html';
        } else {
            alert("❌ Wrong Credentials");
            document.getElementById('loginBtn').innerText = "Secure Login";
        }
    });
}

function logout() { localStorage.removeItem('divineUser'); window.location.href = 'index.html'; }

// ----------------------------------------------------
// ERP INITIALIZATION (Routing Logic)
// ----------------------------------------------------
function initERP() {
    CURRENT_USER = JSON.parse(localStorage.getItem('divineUser'));
    if (!CURRENT_USER) { window.location.href = 'index.html'; return; }
    
    // Setup Header
    document.getElementById('erpHeader').style.display = "flex";
    document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
    
    if(CURRENT_USER.department === 'Sales Department') {
        document.getElementById('offBtn').style.display = "block";
    }

    // Render Navigation based on Department
    renderNav(CURRENT_USER.department);
    
    // Load default tab
    switchTab('dashboard');
}

function renderNav(department) {
    const allowedModules = PERMISSIONS[department] || ["dashboard"];
    const navBar = document.getElementById('navBar');
    navBar.style.display = "flex";
    navBar.innerHTML = "";

    const tabConfig = {
        "dashboard": "📊 Home",
        "crm": "👥 CRM & Leads",
        "finance": "💰 Installments",
        "commission": "💸 Commissions",
        "hr": "🧾 HR & Requisitions",
        "admin": "⚙️ System Admin"
    };

    allowedModules.forEach(mod => {
        let btn = document.createElement("button");
        btn.className = "nav-btn";
        btn.id = `nav-${mod}`;
        btn.innerText = tabConfig[mod] || mod;
        btn.onclick = () => switchTab(mod);
        navBar.appendChild(btn);
    });
}

function switchTab(tabId) {
    // UI Update
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let activeBtn = document.getElementById(`nav-${tabId}`);
    if(activeBtn) activeBtn.classList.add('active');

    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h3 style="text-align:center; padding:30px; color:#0f4c3a;">Loading ${tabId.toUpperCase()} Module...</h3>`;

    // Routing Fetch
    if(tabId === 'dashboard') loadDashboardTab();
    else if(tabId === 'crm') loadCRMTab();
    else if(tabId === 'admin') loadAdminTab();
    else appDiv.innerHTML = `<div class="card"><h3 style="text-align:center;">🚧 ${tabId.toUpperCase()} Module is under construction.</h3></div>`;
}

// ----------------------------------------------------
// TAB RENDERERS (Skeletons)
// ----------------------------------------------------

async function loadDashboardTab() {
    // Generic Dashboard (Everyone sees KPIs based on role)
    const appDiv = document.getElementById('app');
    let html = `<div class="card"><h3 class="header-title">Welcome, ${CURRENT_USER.name}</h3><p>Your performance overview will appear here.</p></div>`;
    appDiv.innerHTML = html;
}

async function loadCRMTab() {
    // Call existing CRM logic here
    if(CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect') {
        // Will load admin CRM view
        const rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
        if(rawData) renderAdminCRM(JSON.parse(rawData));
    } else {
        const rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
        if(rawData) renderSalesCRM(JSON.parse(rawData));
    }
}

async function loadAdminTab() {
     // Settings & User creation (Future integration of Dependent Dropdowns here)
     const appDiv = document.getElementById('app');
     appDiv.innerHTML = `<div class="card"><h3 class="header-title">⚙️ System Control</h3><p>Manage users, departments, and system settings.</p></div>`;
}

// --- EXISTING CRM RENDERERS ADAPTED ---
function renderSalesCRM(data) {
    if(data.status === 'Blocked') { document.getElementById('app').innerHTML = '<h2 style="color:red;text-align:center;">🚫 BLOCKED</h2>'; return; }
    
    let html = `<div class="card desktop-table"><table><thead><tr><th>Client</th><th>Phone</th><th>Status</th><th>ERP ID</th><th>Action</th></tr></thead><tbody>`;
    data.leads.forEach(l => {
      html += `<tr><td><b>${l.name}</b><br><small>${l.product}</small></td><td>${l.phone}</td><td><span class="badge st-con">${l.status}</span></td><td>${l.erp}</td><td><button class="btn btn-blue" onclick="openModal('${l.id}')">Update</button></td></tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('app').innerHTML = html;
}

function renderAdminCRM(data) {
    let stHtml = '<div class="card"><h3 class="header-title">📊 Team Performance</h3><table class="stats-table"><thead><tr><th>Agent</th><th>Total</th><th>New</th><th>Contacted</th><th>Sold</th><th>Reject</th></tr></thead><tbody>';
    for(let ag in data.stats) {
        let s = data.stats[ag];
        stHtml += `<tr><td><b>${ag}</b></td><td>${s.total}</td><td>${s.new}</td><td>${s.contacted}</td><td>${s.sold}</td><td>${s.reject}</td></tr>`;
    }
    stHtml += '</tbody></table></div>';
    document.getElementById('app').innerHTML = stHtml;
}

// Visit Button
async function goVisit() {
    const res = await apiCall('toggleSalesmanStatus', { user: CURRENT_USER.name });
    if(res === 'Visit') {
        document.getElementById('offBtn').innerText = "Return from Visit"; document.getElementById('offBtn').className = "btn btn-green";
        showToast("You are on VISIT.");
    } else {
        document.getElementById('offBtn').innerText = "Go Visit"; document.getElementById('offBtn').className = "btn btn-gold";
        showToast("Welcome Back! You are ACTIVE.");
    }
}
async function openModal(id) {
    document.getElementById('lid').value = id;
    document.getElementById('modal').style.display = 'block';
    const h = await apiCall('getHistory', { id: id });
    if(h) document.getElementById('his').innerHTML = h.map(x => '<b>'+x.date+'</b>: '+x.status+' - '+x.note).join('<br>');
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }
async function saveLead() {
    let p = { id: document.getElementById('lid').value, agent: CURRENT_USER.name, stage: document.getElementById('st').value, erpId: document.getElementById('erp').value };
    const res = await apiCall('processLeadUpdate', { data: p }); alert(res);
    closeModal(); loadCRMTab();
}