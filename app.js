// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbwSHVN9bBre_hF6f4qgwwPc66RQd09H4hueuzK7D4M9VMtgkQqRD6njafwMXimw65Ol/exec";

let CURRENT_USER = null;

// 🛡️ THE MASTER PERMISSION MATRIX (RBAC) - 🔥 Updated Permissions
const PERMISSIONS = {
    "Executive Management": ["dashboard", "hr", "reports"], 
    "System Control": ["dashboard", "crm", "bookings", "finance", "commission", "hr", "reports", "admin"],
    "Sales Department": ["dashboard", "crm", "bookings", "commission", "hr", "reports"], 
    "CR & Accounts": ["dashboard", "bookings", "finance", "commission", "hr", "reports"],
    "Admin & HR Logistic": ["dashboard", "hr", "reports"],
    "Marketing Department": ["dashboard", "marketing", "commission", "reports", "hr"], 
    "Operations": ["dashboard", "operations", "commission", "reports"],
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

// --- CSS Injector for Kanban Board, Wings, Voucher & Mobile Card View ---
document.head.insertAdjacentHTML("beforeend", `
<style>
/* Kanban Styles */
.kanban-board { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
.kanban-col { background: #f4f6f8; min-width: 280px; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.kanban-col h4 { text-align: center; margin-top: 0; padding-bottom: 10px; border-bottom: 2px solid #ccc; }
.kanban-card { background: white; padding: 12px; margin-bottom: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 13px; position:relative; }
.k-red { border-left: 5px solid #dc3545; } .k-yellow { border-left: 5px solid #f1c40f; } .k-green { border-left: 5px solid #198754; } .k-gray { border-left: 5px solid #6c757d; }
.badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }

/* 🌟 Wings (Action Menu) Styles */
.wings-btn { cursor: pointer; color: #0d6efd; text-decoration: underline; font-weight: bold; display: inline-block; margin-bottom: 5px; }
.wings-panel { display: none; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; padding: 10px; margin-top: 10px; animation: fadeIn 0.3s; }
.wings-panel.active { display: block; }
.history-list { max-height: 100px; overflow-y: auto; font-size: 11px; margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 5px; color: #555; }

/* Mobile Friendly Card View CSS */
@media screen and (max-width: 768px) {
    .desktop-table table, .desktop-table thead, .desktop-table tbody, .desktop-table th, .desktop-table td, .desktop-table tr { display: block; }
    .desktop-table thead tr { position: absolute; top: -9999px; left: -9999px; }
    .desktop-table tr { border: 1px solid #ccc; margin-bottom: 15px; border-radius: 8px; background: #fff; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .desktop-table td { border: none; border-bottom: 1px dashed #eee; position: relative; padding-left: 45%; text-align: left; }
    .desktop-table td:before { position: absolute; top: 12px; left: 10px; width: 40%; padding-right: 10px; white-space: nowrap; font-weight: bold; color: #0f4c3a; content: attr(data-label); }
    .desktop-table td:last-child { border-bottom: 0; }
    .kanban-board { flex-direction: column; }
    .kanban-col { width: 100%; min-width: unset; margin-bottom: 15px; }
}

/* Voucher Print Styles */
@media print {
    body * { visibility: hidden; }
    #printVoucherArea, #printVoucherArea * { visibility: visible; }
    #printVoucherArea { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
    .no-print { display: none !important; }
}
.voucher-box { border: 2px solid #0f4c3a; padding: 30px; background: white; font-family: Arial, sans-serif; color: black; max-width: 800px; margin: auto; }
.voucher-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f4c3a; padding-bottom: 10px; margin-bottom: 20px; }
.sign-box { border-top: 1px solid #000; width: 150px; text-align: center; margin-top: 50px; font-size: 12px; font-weight: bold; }
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
    else if(tabId === 'hr') loadHRTab(); 
    else if(tabId === 'reports') loadReportsTab(); // 🔥 Report Live 
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
// 🌟 DASHBOARD LOGIC (Real-time Count Added)
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
        </div>`;
    } else {
        // 🔥 Real-time Dashboard for General Users
        const rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
        let leadsCount = 0; let bookingCount = 0; let tasksCount = 0;
        
        if(rawData) {
            let data = JSON.parse(rawData);
            if(data.leads) {
                leadsCount = data.leads.length;
                bookingCount = data.leads.filter(l => l.status === 'Booking').length;
                tasksCount = data.leads.filter(l => l.status !== 'Booking' && l.status !== 'Reject').length;
            }
        }

        appDiv.innerHTML = `
          <div class="card" style="text-align:center;">
            <h2 class="header-title">Welcome to Divine OS, ${CURRENT_USER.name}!</h2>
            <p style="color:#666;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
          </div>
          <div class="pie-container">
            <div class="stat-box"><div class="stat-num" style="color:#0d6efd">${leadsCount}</div>Assigned Leads</div>
            <div class="stat-box"><div class="stat-num" style="color:#198754">${bookingCount}</div>My Bookings</div>
            <div class="stat-box"><div class="stat-num" style="color:#f39c12">${tasksCount}</div>Pending Tasks</div>
          </div>
        `;
    }
}

// ----------------------------------------------------
// 📄 REPORTS MODULE FRONTEND (Now Live!)
// ----------------------------------------------------
async function loadReportsTab() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
    <div class="card" style="text-align:center; padding: 40px; border-top: 4px solid #6f42c1;">
        <h2 class="header-title">📄 Advanced Reporting Hub</h2>
        <p style="color:#666;">Generate and download system reports based on your access level.</p>
        
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px; flex-wrap:wrap;">
            <select id="repTime" style="max-width:200px;">
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
            </select>
            <button class="btn btn-blue" onclick="generateReport()">Generate & View Report</button>
        </div>
        <div id="reportArea" style="margin-top:30px; text-align:left;"></div>
    </div>`;
}

async function generateReport() {
    document.getElementById('reportArea').innerHTML = "Generating Data...";
    let timeRange = document.getElementById('repTime').value;
    let agent = (CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect') ? 'All Agents' : CURRENT_USER.name;
    const res = await apiCall('generateReportHTML', { agent: agent, time: timeRange });
    document.getElementById('reportArea').innerHTML = res || "No data found for this period.";
}

// ----------------------------------------------------
// 📝 BOOKINGS MODULE (With Update Payment)
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
            <thead><tr><th>Booking ID</th><th>Customer</th><th>Project</th><th>Total Price</th><th>Total Paid</th><th>Agent</th><th>Action</th></tr></thead>
            <tbody>`;
    
    if(bookings.length > 0) {
        bookings.forEach(b => {
            let actionBtn = "";
            if(CURRENT_USER.department === 'CR & Accounts' || b.agent === CURRENT_USER.name) {
                actionBtn = `<button class="btn btn-gold btn-sm" onclick="openPaymentModal('${b.id}', '${b.name}', '${b.price}', '${b.paid}')">Update Payment</button>`;
            }
            html += `<tr>
                <td data-label="Booking ID"><b>${b.id}</b><br><small>${b.leadId}</small></td>
                <td data-label="Customer">${b.name}</td>
                <td data-label="Project">${b.project}</td>
                <td data-label="Total Price">৳ ${b.price}</td>
                <td data-label="Total Paid" style="color:green; font-weight:bold;">৳ ${b.paid}</td>
                <td data-label="Agent">${b.agent}</td>
                <td data-label="Action">${actionBtn}</td>
            </tr>`;
        });
    } else {
        html += `<tr><td colspan="7" style="text-align:center;">No bookings found.</td></tr>`;
    }
    html += `</tbody></table></div>`;
    
    // New Booking Modal
    html += `
    <div id="bookingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:500px; border-top: 4px solid #198754;">
            <h3 class="header-title">Create New Booking</h3>
            <p style="font-size:12px; color:#666;">Note: Only leads marked as 'Booking' appear here.</p>
            
            <label>Select Prospect</label>
            <select id="b_lead" onchange="autoFillBooking()"><option value="">Loading leads...</option></select>
            
            <input type="hidden" id="b_name">
            <input type="hidden" id="b_project">
            
            <label>Lead Type</label>
            <select id="b_type">
                <option value="SGL">SGL (Self Generated Lead) - 4% Comm</option>
                <option value="MPL">MPL (Marketing Provided Lead) - 3% Comm</option>
            </select>
            
            <label>Total Deal Price (Tk)</label>
            <input type="number" id="b_price" placeholder="e.g. 5000000">
            
            <label>Booking / Down Payment Received (Tk)</label>
            <input type="number" id="b_paid" placeholder="e.g. 200000">
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:10px;" onclick="submitBooking()">Submit Booking</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeBookingModal()">Cancel</button>
        </div>
    </div>`;

    // Update Payment Modal
    html += `
    <div id="payModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #f1c40f;">
            <h3 class="header-title">Update Payment</h3>
            <p id="payClientInfo" style="font-size:14px; font-weight:bold; margin-bottom:10px;"></p>
            <input type="hidden" id="p_bkgId">
            <input type="hidden" id="p_oldPaid">
            
            <label>New Amount Received (Tk)</label>
            <input type="number" id="p_newAmt" placeholder="e.g. 50000">
            
            <button class="btn btn-gold" style="width:100%; margin-bottom:10px; margin-top:10px;" onclick="submitPaymentUpdate()">Save Update</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('payModal').style.display='none'">Cancel</button>
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
        opts = '<option value="">❌ No pending leads found.</option>';
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
    showToast(res); closeBookingModal(); loadBookingsTab(); 
}

function openPaymentModal(bkgId, name, price, paid) {
    document.getElementById('p_bkgId').value = bkgId;
    document.getElementById('p_oldPaid').value = paid;
    let due = parseInt(price) - parseInt(paid);
    document.getElementById('payClientInfo').innerHTML = `Client: ${name}<br>Total Due: ৳ ${due}`;
    document.getElementById('payModal').style.display = 'block';
}

async function submitPaymentUpdate() {
    let bkgId = document.getElementById('p_bkgId').value;
    let oldPaid = parseInt(document.getElementById('p_oldPaid').value || 0);
    let newAmt = parseInt(document.getElementById('p_newAmt').value);
    
    if(!newAmt) return alert("Enter amount.");
    document.querySelector('#payModal .btn-gold').innerText = "Saving...";
    
    let totalPaid = oldPaid + newAmt;
    let res = await apiCall('updateBookingPayment', { bkgId: bkgId, totalPaid: totalPaid });
    showToast(res); document.getElementById('payModal').style.display='none'; loadBookingsTab();
}

// ----------------------------------------------------
// 🌟 SALES CRM (KANBAN BOARD WITH ACTION WINGS)
// ----------------------------------------------------
async function loadCRMTab() {
    const appDiv = document.getElementById('app');
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        const rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
        if(rawData) renderAdminCRM(JSON.parse(rawData));
    } else {
        const rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
        if(rawData) renderSalesKanban(JSON.parse(rawData)); 
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
            
            // 🔥 The Wings Card Design
            cols[l.status] += `
            <div class="kanban-card ${colorCls}">
                <b style="font-size:14px;">${l.name}</b><br>
                <div class="wings-btn" onclick="toggleWings('${l.id}')">📞 ${l.phone}</div><br>
                <small style="color:#666">📝 ${l.remarks || 'No remarks'}</small><br>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span class="badge" style="background:#eee; color:#333;">📅 ${dateTxt}</span>
                    <button class="btn btn-blue btn-sm" style="padding:4px 8px; font-size:11px;" onclick="openKanbanModal('${l.id}', '${l.status}', '${l.nextDate}', '${l.remarks}', '${l.erp}')">Edit Stage</button>
                </div>

                <div id="wings_${l.id}" class="wings-panel">
                    <div id="his_${l.id}" class="history-list">Loading history...</div>
                    <div style="display:flex; gap:5px; margin-bottom:5px;">
                        <input type="text" id="cn_${l.id}" placeholder="Short Call Note" style="flex:1; padding:4px; font-size:11px;">
                        <button class="btn btn-green btn-sm" style="padding:4px 8px; font-size:11px;" onclick="saveCallNote('${l.id}')">Add Note</button>
                    </div>
                    <button class="btn btn-gold btn-sm" style="width:100%; font-size:11px;" onclick="openMeetingModal('${l.id}', '${l.name}', '${l.product}')">📅 Schedule Meeting</button>
                </div>
            </div>`;
        }
    });

    let html = `<h3 class="header-title">📊 My Pipeline (Kanban Board)</h3><div class="kanban-board">`;
    for(let status in cols) {
        html += `<div class="kanban-col"><h4 style="color:#0f4c3a">${status}</h4>${cols[status] || '<p style="text-align:center; color:#999; font-size:12px;">Empty</p>'}</div>`;
    }
    html += `</div>`;
    
    // Status Edit Modal
    html += `
    <div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #0d6efd;">
            <h3 class="header-title">Update Pipeline Stage</h3>
            <input type="hidden" id="lid">
            <label>Stage</label>
            <select id="st">
                <option value="New">New</option><option value="Contacted">Contacted</option><option value="Follow-up">Follow-up</option>
                <option value="Interested">Interested</option><option value="Site Visit">Site Visit</option>
                <option value="Booking">Booking (Deal Won)</option><option value="Reject">Reject (Lost)</option>
            </select>
            <label>Next Follow-up Date</label><input type="date" id="nxtDate">
            <label>Stage Change Remarks</label><input type="text" id="rmk" placeholder="Why changing stage?">
            <div id="erpBox"><label>ERP ID (Mandatory for Deal)</label><input id="erp" placeholder="Enter ERP ID"></div>
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="saveLead()">Save Update</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeModal()">Cancel</button>
        </div>
    </div>`;

    // Meeting Schedule Modal
    html += `
    <div id="meetingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #f1c40f;">
            <h3 class="header-title">Schedule Meeting / Site Visit</h3>
            <input type="hidden" id="m_lid">
            <label>Prospect Name</label><input type="text" id="m_name" readonly style="background:#eee;">
            <label>Project</label><input type="text" id="m_prod" readonly style="background:#eee;">
            <div style="display:flex; gap:10px;">
                <div style="flex:1"><label>Date</label><input type="date" id="m_date"></div>
                <div style="flex:1"><label>Time</label><input type="time" id="m_time"></div>
            </div>
            <button class="btn btn-gold" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="saveMeeting()">Confirm Schedule</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('meetingModal').style.display='none'">Cancel</button>
        </div>
    </div>`;
    
    document.getElementById('app').innerHTML = html;
}

async function toggleWings(id) {
    let wing = document.getElementById(`wings_${id}`);
    if (wing.classList.contains('active')) { wing.classList.remove('active'); return; }
    
    // Close other open wings
    document.querySelectorAll('.wings-panel').forEach(p => p.classList.remove('active'));
    wing.classList.add('active');
    
    const h = await apiCall('getHistory', { id: id });
    if(h && h.length > 0) document.getElementById(`his_${id}`).innerHTML = h.map(x => `<b>${x.date}</b>: ${x.note}`).join('<br>');
    else document.getElementById(`his_${id}`).innerHTML = "No call history found.";
}

async function saveCallNote(id) {
    let note = document.getElementById(`cn_${id}`).value;
    if(!note) return;
    document.getElementById(`cn_${id}`).value = "Saving...";
    await apiCall('addCallNote', { id: id, note: note, agent: CURRENT_USER.name });
    showToast("Note Added!");
    toggleWings(id); // Reload wings
}

function openMeetingModal(id, name, prod) {
    document.getElementById('m_lid').value = id;
    document.getElementById('m_name').value = name;
    document.getElementById('m_prod').value = prod;
    document.getElementById('meetingModal').style.display = 'block';
}

async function saveMeeting() {
    let id = document.getElementById('m_lid').value;
    let date = document.getElementById('m_date').value;
    let time = document.getElementById('m_time').value;
    if(!date || !time) return alert("Select Date & Time");
    
    document.querySelector('#meetingModal .btn-gold').innerText = "Scheduling...";
    let note = `🗓️ Meeting Fixed: ${date} at ${time}`;
    await apiCall('addCallNote', { id: id, note: note, agent: CURRENT_USER.name });
    
    showToast("Meeting Scheduled!");
    document.getElementById('meetingModal').style.display = 'none';
}

async function openKanbanModal(id, status, date, rem, erp) {
    document.getElementById('lid').value = id; 
    document.getElementById('st').value = status;
    document.getElementById('nxtDate').value = date; 
    document.getElementById('rmk').value = rem;
    document.getElementById('erp').value = erp; 
    document.getElementById('modal').style.display = 'block';
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
    showToast("Update Saved! Reloading..."); 
    closeModal(); 
    setTimeout(() => { loadCRMTab(); }, 2000); // 2 Sec Delay
}

// ----------------------------------------------------
// 🧾 REQUISITION MODULE (PRIVACY & CONVEYANCE FIXED)
// ----------------------------------------------------
let allRequisitions = [];

async function loadHRTab() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h3 style="text-align:center; padding:30px;">Loading Requisitions...</h3>`;
    allRequisitions = await apiCall('getRequisitions') || [];
    
    let isTL = CURRENT_USER.role.includes('Team Leader');
    let isAdmin = CURRENT_USER.department === 'System Control' || CURRENT_USER.department === 'Admin & HR Logistic';
    let isCEO = CURRENT_USER.role === 'CEO';
    let isAccounts = CURRENT_USER.department === 'CR & Accounts';

    let html = `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; border-top: 4px solid #dc3545;">
        <h3 class="header-title" style="margin:0;">🧾 Expense & Requisitions</h3>
        <button class="btn btn-red" onclick="openReqModal()">+ Create Requisition</button>
    </div>
    
    <div class="card desktop-table">
        <table style="font-size:12px;">
            <thead><tr><th>ID & Date</th><th>Requested By</th><th>Amount & Type</th><th>Purpose & Attach</th><th>TL Auth</th><th>Admin Auth</th><th>CEO Auth</th><th>Accounts</th><th>Final Status</th></tr></thead>
            <tbody>`;
            
    if(allRequisitions.length > 0) {
        allRequisitions.forEach(r => {
            // 🔥 Privacy Logic
            if(!isCEO && !isAdmin && !isAccounts && !isTL && r.user !== CURRENT_USER.name) return;
            if(isTL && r.dept !== CURRENT_USER.department && r.user !== CURRENT_USER.name) return;
            if(isAccounts && r.ceoApp !== 'Approved') return; // Accounts only sees CEO approved

            let btnHtml = "";
            
            if(isTL && r.tlApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'TL')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'TL')">Reject</button>`;
            else if(isAdmin && (r.tlApp === 'Approved' || r.tlApp === 'N/A') && r.adminApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Admin')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'Admin')">Reject</button>`;
            else if(isCEO && r.adminApp === 'Approved' && r.ceoApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'CEO')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'CEO')">Reject</button>`;
            else if(isAccounts && r.ceoApp === 'Approved' && r.accApp === 'Pending') btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Accounts')">Approve/Pay</button>`;
            
            if((r.finalStatus.includes('Logistic 🟢') || r.finalStatus.includes('Printed ✅')) && (isAccounts || r.user === CURRENT_USER.name || isCEO || isAdmin)) {
                btnHtml += `<br><button class="btn btn-blue btn-sm" style="margin-top:5px;" onclick="printVoucher('${r.id}')">🖨️ View Voucher</button>`;
            }

            let attachLink = r.attachment ? `<a href="${r.attachment}" target="_blank" style="color:blue;">📎 View Bill</a>` : '<small style="color:gray;">No Attach</small>';

            html += `<tr>
                <td data-label="ID & Date"><b>${r.id}</b><br><small>${r.date}</small></td>
                <td data-label="Requested By"><b>${r.user}</b><br><small>${r.dept}</small></td>
                <td data-label="Amount"><b>৳ ${r.amount}</b><br><small>${r.reqType}</small></td>
                <td data-label="Purpose">${r.purpose}<br>${attachLink}</td>
                <td data-label="TL Auth"><span class="badge ${r.tlApp==='Approved'?'k-green':r.tlApp==='Rejected'?'k-red':'k-yellow'}">${r.tlApp}</span></td>
                <td data-label="Admin Auth"><span class="badge ${r.adminApp==='Approved'?'k-green':r.adminApp==='Rejected'?'k-red':'k-yellow'}">${r.adminApp}</span></td>
                <td data-label="CEO Auth"><span class="badge ${r.ceoApp==='Approved'?'k-green':r.ceoApp==='Rejected'?'k-red':'k-yellow'}">${r.ceoApp}</span></td>
                <td data-label="Accounts"><span class="badge ${r.accApp==='Approved'?'k-green':'k-yellow'}">${r.accApp}</span></td>
                <td data-label="Status"><b>${r.finalStatus}</b><br>${btnHtml}</td>
            </tr>`;
        });
    } else { html += `<tr><td colspan="9" style="text-align:center;">No requisitions found.</td></tr>`; }
    
    html += `</tbody></table></div>`;

    html += `
    <div id="reqModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #dc3545; max-height:80vh; overflow-y:auto;">
            <h3 class="header-title">Create Requisition</h3>
            <label>Requisition Type</label><select id="rqType"></select>
            <label>Amount Needed (Tk)</label><input type="number" id="rqAmt" placeholder="e.g. 5000">
            <div style="display:flex; gap:10px;">
                <div style="flex:1"><label>Expense Category</label><select id="rqCat"><option>Travel & Transport</option><option>Office Supply</option><option>Marketing</option><option>Legal & Bank</option></select></div>
                <div style="flex:1"><label>Payment Mode</label><select id="rqMode"><option>Cash</option><option>Bank Transfer</option><option>Advance</option></select></div>
            </div>
            <label>Purpose / Details</label><input type="text" id="rqPur" placeholder="Detail explanation">
            <label>Attachment (Bill Photo / Drive Link)</label><input type="text" id="rqAtt" placeholder="Paste URL (Optional)">
            <button class="btn btn-red" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="submitReq()">Submit Requisition</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('reqModal').style.display='none'">Cancel</button>
        </div>
    </div>`;
    appDiv.innerHTML = html;
}

function openReqModal() {
    let dept = CURRENT_USER.department;
    // 🔥 Convexance added to all default options
    let opts = "<option>Conveyance (Travel Bill)</option>"; 
    
    if(dept === 'Sales Department') opts += "<option>Mobile Bill</option><option>Client Meeting Expense</option><option>Site Visit Expense</option>";
    else if(dept === 'Marketing Department') opts += "<option>Campaign Boost</option><option>Video Shoot Cost</option><option>Designer Cost</option><option>Software Subscription</option>";
    else if(dept === 'CR & Accounts') opts += "<option>Bank Charges</option><option>Document Processing</option><option>Stamp / Legal Fees</option>";
    else if(dept === 'Admin & HR Logistic') opts += "<option>Office Desk / Chair</option><option>Printer & Supply</option><option>Internet Bill</option><option>Electricity</option>";
    else opts += "<option>Stationary</option><option>Cleaning Supplies</option><option>Minor Repair</option><option>General Utility</option>";
    
    document.getElementById('rqType').innerHTML = opts;
    document.getElementById('reqModal').style.display = 'block';
}

async function submitReq() {
    let type = document.getElementById('rqType').value;
    let amt = document.getElementById('rqAmt').value; 
    let cat = document.getElementById('rqCat').value;
    let mode = document.getElementById('rqMode').value;
    let pur = document.getElementById('rqPur').value;
    let att = document.getElementById('rqAtt').value;

    if(!amt || !pur) return alert("Amount and Purpose are mandatory!");
    document.querySelector('#reqModal .btn-red').innerText = "Submitting...";
    
    let reqData = { user: CURRENT_USER.name, dept: CURRENT_USER.department, amount: amt, reqType: type, category: cat, payMode: mode, purpose: pur, attachment: att };
    let res = await apiCall('createRequisition', { data: reqData });
    showToast("Submitted! Reloading..."); document.getElementById('reqModal').style.display='none'; 
    setTimeout(() => { loadHRTab(); }, 2000);
}

async function approveReq(id, level) {
    if(confirm(`Approve requisition at ${level} level?`)) {
        let res = await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Approved' } });
        showToast("Approved! Reloading..."); setTimeout(() => { loadHRTab(); }, 2000);
    }
}
async function rejectReq(id, level) {
    if(confirm(`Reject this requisition?`)) {
        let res = await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Rejected' } });
        showToast("Rejected! Reloading..."); setTimeout(() => { loadHRTab(); }, 2000);
    }
}

// 🖨️ PDF Cash Voucher Print Logic (Professional Pad Design)
function printVoucher(reqId) {
    let req = allRequisitions.find(r => r.id === reqId);
    if(!req) return;

    let printContent = `
    <html>
    <head>
        <title>Divine Group Voucher - ${req.id}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .pad-container { max-width: 800px; margin: 0 auto; border: 2px solid #0f4c3a; padding: 40px; position: relative; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f4c3a; padding-bottom: 15px; margin-bottom: 30px; }
            .stamp { position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: #28a745; border: 4px solid #28a745; font-size: 35px; font-weight: bold; padding: 15px; border-radius: 10px; opacity: 0.2; pointer-events: none; text-transform: uppercase; letter-spacing: 2px; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 15px; }
            .info-table td { padding: 12px; border: 1px solid #ddd; }
            .sign-area { display: flex; justify-content: space-between; margin-top: 80px; }
            .sign-box { text-align: center; font-size: 14px; width: 30%; }
            .sign-line { border-top: 1px solid #000; margin-bottom: 5px; font-weight: bold; padding-top: 5px; }
            .digital-sign { font-family: 'Brush Script MT', cursive, Georgia, sans-serif; font-size: 24px; color: #0f4c3a; margin-bottom: 2px; }
            .audit-trail { background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 13px; color: #555; line-height: 1.6; }
        </style>
    </head>
    <body>
        <div class="pad-container">
            <div class="stamp">Approved & Verified</div>
            <div class="header">
                <div><img src="https://divinegroupbd.net/images/divine-group-logo.png" width="180" alt="Divine Group"><h2 style="margin: 8px 0 0 0; color: #0f4c3a; font-size: 22px;">Cash / Payment Voucher</h2></div>
                <div style="text-align: right; font-size: 14px; line-height: 1.5;"><b>Voucher No:</b> ${req.id}<br><b>Issue Date:</b> ${new Date().toLocaleDateString()}<br><b style="color:#198754; border: 1px solid #198754; padding: 2px 5px; border-radius: 4px;">Status: PAID ✅</b></div>
            </div>
            <table class="info-table">
                <tr><td width="30%"><b>Requested By:</b></td><td><b>${req.user}</b> <span style="color:#666;">(${req.dept})</span></td></tr>
                <tr><td><b>Expense Category:</b></td><td>${req.category} - ${req.reqType}</td></tr>
                <tr><td><b>Purpose / Details:</b></td><td>${req.purpose}</td></tr>
                <tr><td><b>Payment Mode:</b></td><td>${req.payMode}</td></tr>
                <tr style="background:#f4f6f8;"><td><b>Amount Approved:</b></td><td style="font-size:22px; color:#dc3545;"><b>৳ ${req.amount} /_</b></td></tr>
            </table>
            <div class="audit-trail"><b style="color:#000;">System Audit Trail:</b><br><span style="color:#198754;">✔</span> TL Auth: <b>${req.tlApp}</b><br><span style="color:#198754;">✔</span> Admin Auth: <b>${req.adminApp}</b><br><span style="color:#198754;">✔</span> CEO Auth: <b>${req.ceoApp}</b><br><span style="color:#198754;">✔</span> Accounts Disbursed: <b>${req.accApp}</b></div>
            <div class="sign-area">
                <div class="sign-box"><div class="digital-sign">${req.user}</div><div class="sign-line">Prepared By</div></div>
                <div class="sign-box"><div class="digital-sign" style="color: #d35400;">System Verified</div><div class="sign-line">Authorized Signatory</div></div>
                <div class="sign-box"><br><br><br><div class="sign-line">Receiver's Signature (Cash)</div></div>
            </div>
            <p style="text-align:center; font-size:11px; color:#999; margin-top:40px; border-top: 1px dashed #eee; padding-top: 10px;">This is a digitally generated document. Powered by Divine OS.</p>
        </div>
        <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); }</script>
    </body>
    </html>`;

    let printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(printContent);
    printWindow.document.close();

    if(CURRENT_USER.department === 'CR & Accounts' && req.finalStatus.includes('Logistic 🟢')) {
        apiCall('markVoucherPrinted', { id: reqId });
    }
}

// ----------------------------------------------------
// OLD ADMIN TAB & ACTIONS (UNTOUCHED)
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