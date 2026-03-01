// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbwIx16ICpQeAd0d72Jk0YRWJwq3mSoP1vS5yaaCcbcbIMR0Kfafr9ZlGRI0QokuVeyr/exec";

let CURRENT_USER = null;

// 🛡️ THE MASTER PERMISSION MATRIX (RBAC)
const PERMISSIONS = {
    "Executive Management": ["dashboard", "hr", "reports"], 
    "System Control": ["dashboard", "crm", "bookings", "finance", "commission", "hr", "reports", "admin"],
    "Sales Department": ["dashboard", "crm", "bookings", "commission", "hr", "reports"], 
    "CR & Accounts": ["dashboard", "bookings", "finance", "commission", "hr", "reports"],
    "Admin & HR Logistic": ["dashboard", "hr", "reports", "admin"],
    "Marketing Department": ["dashboard", "marketing", "reports"],
    "Operations": ["dashboard", "operations", "reports"],
    "Office Support": ["dashboard", "hr"]
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
    "reports": "📄 Reports",
    "admin": "⚙️ Admin Control"
};

// --- CSS Injector for Kanban Board ---
document.head.insertAdjacentHTML("beforeend", `
<style>
.kanban-board { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
.kanban-col { background: #f4f6f8; min-width: 280px; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.kanban-col h4 { text-align: center; margin-top: 0; padding-bottom: 10px; border-bottom: 2px solid #ccc; }
.kanban-card { background: white; padding: 12px; margin-bottom: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 13px; }
.k-red { border-left: 5px solid #dc3545; } .k-yellow { border-left: 5px solid #f1c40f; } .k-green { border-left: 5px solid #198754; } .k-gray { border-left: 5px solid #6c757d; }
.badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
</style>`);

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
    
    document.getElementById('erpHeader').style.display = "flex";
    document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
    
    if(CURRENT_USER.department === 'Sales Department') {
        document.getElementById('offBtn').style.display = "block";
    }

    renderNav(CURRENT_USER.department);
    switchTab('dashboard'); 
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
    else if(tabId === 'bookings') loadBookingsTab(); 
    else if(tabId === 'hr') loadHRTab(); // 🔥 Requisition Connected
    else if(tabId === 'reports') loadComingSoonTab("Reports");
    else if(tabId === 'finance') loadComingSoonTab("Installments");
    else if(tabId === 'commission') loadComingSoonTab("Commissions");
    else loadComingSoonTab(tabId);
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

// ----------------------------------------------------
// 🌟 10-POINT CEO DASHBOARD (UNTOUCHED)
// ----------------------------------------------------
async function loadDashboardTab() {
    const appDiv = document.getElementById('app');
    
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        appDiv.innerHTML = `
        <div style="padding:10px; animation: fadeIn 0.5s;">
            <h2 class="header-title" style="text-align:center; color:#0f4c3a;">👑 Executive KPI Dashboard</h2>
            
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
                <div class="stat-box" style="flex:1; background:#e8f5e9;"><div class="stat-num" style="color:#198754">0</div>Total Bookings</div>
                <div class="stat-box" style="flex:1; background:#fff3cd;"><div class="stat-num" style="color:#f39c12">৳ 0</div>Total Revenue</div>
                <div class="stat-box" style="flex:1; background:#cff4fc;"><div class="stat-num" style="color:#0dcaf0">৳ 0</div>Collection</div>
                <div class="stat-box" style="flex:1; background:#f8d7da;"><div class="stat-num" style="color:#dc3545">৳ 0</div>Total Due</div>
            </div>

            <div style="display:flex; gap:15px; flex-wrap:wrap;">
                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #198754;">
                    <h3 class="header-title">💰 Cash Flow Snapshot</h3>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:5px;"><span>Opening Balance:</span> <b>৳ 500,000</b></div>
                    <div style="display:flex; justify-content:space-between; padding-top:5px; color:green;"><span>+ Total Collection:</span> <b>৳ 0</b></div>
                    <div style="display:flex; justify-content:space-between; color:red;"><span>- Expenses (Requisition):</span> <b>৳ 0</b></div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:18px; font-weight:bold; background:#f4f6f8; padding:5px;"><span>Current Position:</span> <span>৳ 500,000</span></div>
                </div>

                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #f1c40f;">
                    <h3 class="header-title">🧾 Financial & Requisition</h3>
                    <p>This Month Revenue: <b>৳ 0</b> <span style="color:green; font-size:12px;">(↑ 0% Growth)</span></p>
                    <p>Pending Requisitions: <b style="color:red; font-size:18px;">0</b></p>
                    <p>Total Approved Expenses: <b>৳ 0</b></p>
                </div>
            </div>

            <div style="display:flex; gap:15px; flex-wrap:wrap; margin-top:15px;">
                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #0d6efd;">
                    <h3 class="header-title">🏆 Top Sales Performers</h3>
                    <table class="data-table" style="width:100%; text-align:left;">
                        <tr><th>Name</th><th>Bookings</th><th>Revenue</th></tr>
                        <tr><td colspan="3" style="text-align:center; color:#666;">Waiting for booking data...</td></tr>
                    </table>
                </div>

                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #6f42c1;">
                    <h3 class="header-title">📢 Marketing & ROI</h3>
                    <p>Total Ad Spend: <b>৳ 0</b></p>
                    <p>Leads Generated: <b>0</b></p>
                    <p>Cost Per Lead (CPL): <b>৳ 0</b></p>
                    <p>Overall ROI: <b style="color:green;">0%</b></p>
                </div>
            </div>
            
            <div class="card" style="margin-top:15px; background:#fff5f5; border:1px solid #dc3545;">
                <h3 class="header-title" style="color:#dc3545;">⚠️ Risk Zone & Today's Snapshot</h3>
                <p><b>Today:</b> 0 Leads | 0 Bookings | ৳ 0 Collection</p>
                <p style="color:#dc3545;"><b>Overdue Installments:</b> 0 Clients</p>
            </div>
        </div>`;
    } else {
        appDiv.innerHTML = `
          <div class="card" style="text-align:center;">
            <h2 class="header-title">Welcome to Divine OS, ${CURRENT_USER.name}!</h2>
            <p style="color:#666;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
          </div>
          <div class="pie-container">
            <div class="stat-box"><div class="stat-num" style="color:#0d6efd">0</div>Assigned Leads</div>
            <div class="stat-box"><div class="stat-num" style="color:#198754">0</div>My Bookings</div>
            <div class="stat-box"><div class="stat-num" style="color:#f39c12">0</div>Pending Tasks</div>
          </div>
        `;
    }
}

// ----------------------------------------------------
// 📝 BOOKINGS MODULE FRONTEND (UNTOUCHED)
// ----------------------------------------------------
async function loadBookingsTab() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h3 style="text-align:center; padding:30px; color:#0f4c3a;">Fetching Bookings...</h3>`;
    
    const bookings = await apiCall('getBookings', { user: CURRENT_USER.name, role: CURRENT_USER.role, dept: CURRENT_USER.department });
    if(!bookings) return;

    let html = `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <h3 class="header-title" style="margin:0;">📝 Bookings Management</h3>
        ${(CURRENT_USER.department === 'Sales Department' || CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect') 
          ? `<button class="btn btn-green" onclick="openBookingModal()">+ Add New Booking</button>` : ''}
    </div>
    
    <div class="card desktop-table">
        <table>
            <thead><tr><th>Booking ID</th><th>Customer</th><th>Project</th><th>Total Price</th><th>Booking Money</th><th>Agent</th><th>Date</th></tr></thead>
            <tbody>`;
    
    if(bookings.length > 0) {
        bookings.forEach(b => {
            html += `<tr><td><b>${b.id}</b><br><small>${b.leadId}</small></td><td>${b.name}</td><td>${b.project}</td><td>৳ ${b.price}</td><td style="color:green; font-weight:bold;">৳ ${b.paid}</td><td>${b.agent}</td><td>${b.date}</td></tr>`;
        });
    } else {
        html += `<tr><td colspan="7" style="text-align:center;">No bookings found. Try converting a lead to 'Sold' first!</td></tr>`;
    }
    html += `</tbody></table></div>`;
    
    html += `
    <div id="bookingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:500px; border-top: 4px solid #198754;">
            <h3 class="header-title">Create New Booking</h3>
            <p style="font-size:12px; color:#666;">Note: Only leads marked as 'Sold' appear here.</p>
            
            <label>Select Sold Lead</label>
            <select id="b_lead" onchange="autoFillBooking()"><option value="">Loading leads...</option></select>
            
            <input type="hidden" id="b_name">
            <input type="hidden" id="b_project">
            
            <label>Lead Type</label>
            <select id="b_type">
                <option value="SGL">SGL (Self Generated Lead) - 4% Comm</option>
                <option value="MPL">MPL (Marketing Provided Lead) - 3% Comm</option>
            </select>
            
            <label>Total Price (Tk)</label>
            <input type="number" id="b_price" placeholder="e.g. 5000000">
            
            <label>Booking Money Received (Tk)</label>
            <input type="number" id="b_paid" placeholder="e.g. 200000">
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:10px;" onclick="submitBooking()">Submit Booking</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeBookingModal()">Cancel</button>
        </div>
    </div>`;
    
    appDiv.innerHTML = html;
}

let currentSoldLeads = [];

async function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'block';
    document.getElementById('b_lead').innerHTML = '<option>Loading...</option>';
    
    currentSoldLeads = await apiCall('getSoldLeads', { user: CURRENT_USER.name, role: CURRENT_USER.role });
    
    let opts = '<option value="">-- Select a Lead --</option>';
    if(currentSoldLeads && currentSoldLeads.length > 0) {
        currentSoldLeads.forEach(l => {
            opts += `<option value="${l.id}">${l.name} (${l.project})</option>`;
        });
    } else {
        opts = '<option value="">❌ No pending sold leads found.</option>';
    }
    document.getElementById('b_lead').innerHTML = opts;
}

function autoFillBooking() {
    let selectedId = document.getElementById('b_lead').value;
    let lead = currentSoldLeads.find(l => l.id === selectedId);
    if(lead) {
        document.getElementById('b_name').value = lead.name;
        document.getElementById('b_project').value = lead.project;
    }
}

function closeBookingModal() { document.getElementById('bookingModal').style.display = 'none'; }

async function submitBooking() {
    let leadId = document.getElementById('b_lead').value;
    let price = document.getElementById('b_price').value;
    let paid = document.getElementById('b_paid').value;
    let name = document.getElementById('b_name').value;
    let project = document.getElementById('b_project').value;
    let type = document.getElementById('b_type').value;
    
    if(!leadId || !price || !paid) return alert("Please fill all fields.");
    
    document.querySelector('#bookingModal .btn-green').innerText = "Processing...";
    
    let payload = { leadId: leadId, customerName: name, project: project, totalPrice: price, bookingMoney: paid, agent: CURRENT_USER.name, leadType: type };
    
    let res = await apiCall('createBooking', { data: payload });
    showToast(res);
    closeBookingModal();
    loadBookingsTab(); 
}

// ----------------------------------------------------
// 🌟 SALES CRM (NOW WITH KANBAN) & ADMIN RENDERERS
// ----------------------------------------------------
async function loadCRMTab() {
    const appDiv = document.getElementById('app');
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        const rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
        if(rawData) renderAdminCRM(JSON.parse(rawData));
    } else {
        const rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
        if(rawData) renderSalesKanban(JSON.parse(rawData)); // 🔥 Calling Kanban Instead of Table
    }
}

function renderSalesKanban(data) {
    if(data.status === 'Blocked') { document.getElementById('app').innerHTML = '<h2 style="color:red;text-align:center;">🚫 BLOCKED</h2>'; return; }
    
    let cols = { "New": "", "Contacted": "", "Follow-up": "", "Interested": "", "Site Visit": "" };
    const today = new Date().toISOString().split('T')[0];

    data.leads.forEach(l => {
        if(cols[l.status] !== undefined) {
            let colorCls = "k-gray"; let dateTxt = "No Date Set";
            if(l.nextDate) {
                dateTxt = l.nextDate;
                if(l.nextDate < today) colorCls = "k-red"; 
                else if(l.nextDate === today) colorCls = "k-yellow"; 
                else colorCls = "k-green"; 
            }
            
            cols[l.status] += `
            <div class="kanban-card ${colorCls}">
                <b style="font-size:14px;">${l.name}</b><br>
                <span style="color:#0f4c3a">📞 ${l.phone}</span><br>
                <small style="color:#666">📝 ${l.remarks || 'No remarks'}</small><br>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span class="badge" style="background:#eee; color:#333;">📅 ${dateTxt}</span>
                    <button class="btn btn-blue btn-sm" style="padding:4px 8px; font-size:11px;" onclick="openKanbanModal('${l.id}', '${l.status}', '${l.nextDate}', '${l.remarks}', '${l.erp}')">Update</button>
                </div>
            </div>`;
        }
    });

    let html = `<h3 class="header-title">📊 My Pipeline (Kanban Board)</h3><div class="kanban-board">`;
    for(let status in cols) {
        html += `<div class="kanban-col"><h4 style="color:#0f4c3a">${status}</h4>${cols[status] || '<p style="text-align:center; color:#999; font-size:12px;">Empty</p>'}</div>`;
    }
    html += `</div>`;
    
    // Inject enhanced Modal
    html += `
    <div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #0d6efd;">
            <h3 class="header-title">Update Lead Status</h3>
            <input type="hidden" id="lid">
            <label>Pipeline Stage</label>
            <select id="st">
                <option value="New">New</option><option value="Contacted">Contacted</option><option value="Follow-up">Follow-up</option>
                <option value="Interested">Interested</option><option value="Site Visit">Site Visit</option>
                <option value="Sold">Sold (Convert to Booking)</option><option value="Reject">Reject (Lost)</option>
            </select>
            <label>Next Follow-up Date</label>
            <input type="date" id="nxtDate">
            <label>Follow-up Remarks</label>
            <input type="text" id="rmk" placeholder="What did the client say?">
            <div id="erpBox"><label>ERP ID (Mandatory for Deal)</label><input id="erp" placeholder="Enter ERP ID"></div>
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="saveLead()">Save Update</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeModal()">Cancel</button>
            <div style="margin-top:15px; background:#f4f6f8; padding:10px; font-size:12px; border-radius:5px;" id="his">History will load here...</div>
        </div>
    </div>`;
    
    document.getElementById('app').innerHTML = html;
}

// Kanban Modal Logics
async function openKanbanModal(id, status, date, rem, erp) {
    document.getElementById('lid').value = id; 
    document.getElementById('st').value = status;
    document.getElementById('nxtDate').value = date; 
    document.getElementById('rmk').value = rem;
    document.getElementById('erp').value = erp; 
    document.getElementById('modal').style.display = 'block';
    
    // Load History
    document.getElementById('his').innerHTML = "Loading history...";
    const h = await apiCall('getHistory', { id: id });
    if(h) document.getElementById('his').innerHTML = h.map(x => `<b>${x.date}</b>: ${x.status} - ${x.note}`).join('<br>');
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }

async function saveLead() {
    let p = { 
        id: document.getElementById('lid').value, agent: CURRENT_USER.name, 
        stage: document.getElementById('st').value, erpId: document.getElementById('erp').value,
        nextDate: document.getElementById('nxtDate').value, remarks: document.getElementById('rmk').value
    };
    if(p.stage === 'Contacted' && !p.erpId) return alert("❌ ERP ID is Required!");
    document.querySelector('#modal .btn-green').innerText = "Saving...";
    const res = await apiCall('processLeadUpdate', { data: p }); 
    showToast(res); closeModal(); loadCRMTab();
}

// ----------------------------------------------------
// 🧾 REQUISITION MODULE (4-LEVEL APPROVAL)
// ----------------------------------------------------
async function loadHRTab() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h3 style="text-align:center; padding:30px;">Loading Requisitions...</h3>`;
    const reqs = await apiCall('getRequisitions');
    
    let isTL = CURRENT_USER.role.includes('Team Leader');
    let isAdmin = CURRENT_USER.department === 'System Control' || CURRENT_USER.department === 'Admin & HR Logistic';
    let isCEO = CURRENT_USER.role === 'CEO';
    let isAccounts = CURRENT_USER.department === 'CR & Accounts';

    let html = `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; border-top: 4px solid #dc3545;">
        <h3 class="header-title" style="margin:0;">🧾 Expense & Requisitions</h3>
        <button class="btn btn-red" onclick="document.getElementById('reqModal').style.display='block'">+ Create Requisition</button>
    </div>
    
    <div class="card desktop-table">
        <table style="font-size:12px;">
            <thead><tr><th>ID & Date</th><th>Requested By</th><th>Amount</th><th>Purpose</th><th>TL Auth</th><th>Admin Auth</th><th>CEO Auth</th><th>Accounts</th><th>Status</th></tr></thead>
            <tbody>`;
            
    if(reqs && reqs.length > 0) {
        reqs.forEach(r => {
            if(!isCEO && !isAdmin && !isAccounts && !isTL && r.user !== CURRENT_USER.name) return;
            if(isTL && r.dept !== CURRENT_USER.department && r.user !== CURRENT_USER.name) return;

            let btnHtml = "";
            if(isTL && r.tlApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'TL')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'TL')">Reject</button>`;
            else if(isAdmin && r.tlApp === 'Approved' && r.adminApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Admin')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'Admin')">Reject</button>`;
            else if(isCEO && r.adminApp === 'Approved' && r.ceoApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'CEO')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'CEO')">Reject</button>`;
            else if(isAccounts && r.ceoApp === 'Approved' && r.accApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Accounts')">Pay Now</button>`;

            html += `<tr>
                <td><b>${r.id}</b><br><small>${r.date}</small></td>
                <td><b>${r.user}</b><br><small>${r.dept}</small></td>
                <td style="color:red; font-weight:bold;">৳ ${r.amount}</td>
                <td>${r.purpose}</td>
                <td><span class="badge ${r.tlApp==='Approved'?'k-green':r.tlApp==='Rejected'?'k-red':'k-yellow'}">${r.tlApp}</span></td>
                <td><span class="badge ${r.adminApp==='Approved'?'k-green':r.adminApp==='Rejected'?'k-red':'k-yellow'}">${r.adminApp}</span></td>
                <td><span class="badge ${r.ceoApp==='Approved'?'k-green':r.ceoApp==='Rejected'?'k-red':'k-yellow'}">${r.ceoApp}</span></td>
                <td><span class="badge ${r.accApp==='Approved'?'k-green':'k-yellow'}">${r.accApp}</span></td>
                <td><b>${r.finalStatus}</b><br>${btnHtml}</td>
            </tr>`;
        });
    } else { html += `<tr><td colspan="9" style="text-align:center;">No requisitions found.</td></tr>`; }
    
    html += `</tbody></table></div>`;

    // Create Modal
    html += `
    <div id="reqModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #dc3545;">
            <h3 class="header-title">Create Requisition</h3>
            <label>Amount Needed (Tk)</label><input type="number" id="rqAmt" placeholder="e.g. 5000">
            <label>Purpose / Details</label><input type="text" id="rqPur" placeholder="e.g. Office Stationery">
            <button class="btn btn-red" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="submitReq()">Submit Requisition</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('reqModal').style.display='none'">Cancel</button>
        </div>
    </div>`;
    appDiv.innerHTML = html;
}

async function submitReq() {
    let amt = document.getElementById('rqAmt').value; let pur = document.getElementById('rqPur').value;
    if(!amt || !pur) return alert("Please fill all fields!");
    document.querySelector('#reqModal .btn-red').innerText = "Submitting...";
    let res = await apiCall('createRequisition', { data: { user: CURRENT_USER.name, dept: CURRENT_USER.department, amount: amt, purpose: pur } });
    showToast(res); document.getElementById('reqModal').style.display='none'; loadHRTab();
}
async function approveReq(id, level) {
    if(confirm(`Approve requisition at ${level} level?`)) {
        let res = await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Approved' } });
        showToast(res); loadHRTab();
    }
}
async function rejectReq(id, level) {
    if(confirm(`Reject this requisition? This will stop the workflow.`)) {
        let res = await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Rejected' } });
        showToast(res); loadHRTab();
    }
}

// ----------------------------------------------------
// OLD ADMIN TAB & FUNCTIONS (UNTOUCHED)
// ----------------------------------------------------
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

function renderAdminCRM(data) {
    let stHtml = '<div class="card"><h3 class="header-title">📊 Team CRM Performance</h3><table class="stats-table"><thead><tr><th>Agent</th><th>Total Leads</th><th>New</th><th>Contacted</th><th>Sold</th><th>Reject</th></tr></thead><tbody>';
    for(let ag in data.stats) {
        let s = data.stats[ag];
        stHtml += `<tr><td><b>${ag}</b></td><td>${s.total}</td><td>${s.new}</td><td>${s.contacted}</td><td><b style="color:green">${s.sold}</b></td><td><b style="color:red">${s.reject}</b></td></tr>`;
    }
    stHtml += '</tbody></table></div>';
    
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

async function toggleAgent(name) { const res = await apiCall('toggleAgentStatus', { name: name }); showToast(res); loadAdminTab(); }
async function toggleHoliday() {
    if(confirm("Toggle Global Holiday Mode?")) {
        const res = await apiCall('toggleHolidayMode');
        let btn = document.getElementById('holBtn');
        btn.innerText = (res === "ON" ? "ON (Sleeping)" : "OFF (Active)"); btn.className = (res === "ON" ? "btn btn-red" : "btn btn-green");
    }
}
async function addLead() {
    let p = { name: document.getElementById('cName').value, phone: document.getElementById('cPhone').value, product: document.getElementById('cProd').value, agent: document.getElementById('cAgent').value };
    if(!p.phone) return alert("Phone required!");
    const res = await apiCall('adminManualEntry', { data: p }); showToast(res); loadAdminTab();
}
async function reassign(id) {
    let agent = document.getElementById('re_'+id).value; if(!agent) return alert("Select an agent");
    const res = await apiCall('adminReassignLead', { id: id, agent: agent }); showToast("Reassigned Successfully!"); loadCRMTab();
}