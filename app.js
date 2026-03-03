// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbzg7wlyv4_KAqU3eQloifDnntwj4uhI8UDsbCbfSRXFFdGfjv4NLloEl5XKfZBFwBEO/exec";

let CURRENT_USER = null;

// 🚀 SUPER FAST CACHE SYSTEM
let CACHE = {
    dashboardAdmin: null,
    dashboardSales: null,
    bookings: null,
    soldLeads: null,
    requisitions: null,
    history: {}
};

function clearCache() {
    CACHE.dashboardAdmin = null;
    CACHE.dashboardSales = null;
    CACHE.bookings = null;
    CACHE.soldLeads = null;
    CACHE.requisitions = null;
}

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

// --- CSS Injector for Kanban Board, Wings, Voucher, Search & Mobile Card View ---
document.head.insertAdjacentHTML("beforeend", `
<style>
/* Kanban & Wings Styles */
.kanban-board { 
    display: flex; 
    gap: 15px; 
    overflow-x: auto; 
    padding-bottom: 10px; 
}
.kanban-col { 
    background: #f4f6f8; 
    min-width: 280px; 
    border-radius: 8px; 
    padding: 10px; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
}
.kanban-col h4 { 
    text-align: center; 
    margin-top: 0; 
    padding-bottom: 10px; 
    border-bottom: 2px solid #ccc; 
}
.kanban-card { 
    background: white; 
    padding: 12px; 
    margin-bottom: 10px; 
    border-radius: 6px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    font-size: 13px; 
    position: relative; 
}
.k-red { border-left: 5px solid #dc3545; } 
.k-yellow { border-left: 5px solid #f1c40f; } 
.k-green { border-left: 5px solid #198754; } 
.k-gray { border-left: 5px solid #6c757d; }
.badge { 
    display: inline-block; 
    padding: 3px 8px; 
    border-radius: 12px; 
    font-size: 11px; 
    font-weight: bold; 
}
.wings-btn { 
    cursor: pointer; 
    color: #0d6efd; 
    text-decoration: underline; 
    font-weight: bold; 
    display: inline-block; 
    margin-bottom: 5px; 
}
.wings-panel { 
    display: none; 
    background: #f8f9fa; 
    border: 1px solid #ddd; 
    border-radius: 5px; 
    padding: 10px; 
    margin-top: 10px; 
    animation: fadeIn 0.3s; 
}
.wings-panel.active { 
    display: block; 
}
.history-list { 
    max-height: 100px; 
    overflow-y: auto; 
    font-size: 11px; 
    margin-bottom: 10px; 
    border-bottom: 1px dashed #ccc; 
    padding-bottom: 5px; 
    color: #555; 
}

/* 🔍 Smart Search Styles */
.search-box { 
    display: flex; 
    align-items: center; 
    background: #fff; 
    padding: 5px 10px; 
    border-radius: 20px; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
    margin-left: auto; 
    border: 1px solid #ccc; 
}
.search-box input { 
    border: none; 
    outline: none; 
    padding: 5px; 
    width: 200px; 
    font-size: 13px; 
}

/* CEO Dashboard Bar Chart CSS */
.bar-wrap { 
    background: #eee; 
    border-radius: 10px; 
    height: 15px; 
    width: 100%; 
    margin-top: 5px; 
    overflow: hidden; 
}
.bar-fill { 
    height: 100%; 
    background: #198754; 
}

/* Mobile Friendly Card View CSS */
@media screen and (max-width: 768px) {
    .desktop-table table, .desktop-table thead, .desktop-table tbody, .desktop-table th, .desktop-table td, .desktop-table tr { 
        display: block; 
    }
    .desktop-table thead tr { 
        position: absolute; 
        top: -9999px; 
        left: -9999px; 
    }
    .desktop-table tr { 
        border: 1px solid #ccc; 
        margin-bottom: 15px; 
        border-radius: 8px; 
        background: #fff; 
        padding: 10px; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }
    .desktop-table td { 
        border: none; 
        border-bottom: 1px dashed #eee; 
        position: relative; 
        padding-left: 45%; 
        text-align: left; 
    }
    .desktop-table td:before { 
        position: absolute; 
        top: 12px; 
        left: 10px; 
        width: 40%; 
        padding-right: 10px; 
        white-space: nowrap; 
        font-weight: bold; 
        color: #0f4c3a; 
        content: attr(data-label); 
    }
    .desktop-table td:last-child { 
        border-bottom: 0; 
    }
    .kanban-board { 
        flex-direction: column; 
    }
    .kanban-col { 
        width: 100%; 
        min-width: unset; 
        margin-bottom: 15px; 
    }
    .search-box input { 
        width: 120px; 
    }
}

/* Voucher Print Styles with 🖃 Round Rubber Stamp */
@media print {
    body * { visibility: hidden; }
    #printVoucherArea, #printVoucherArea * { visibility: visible; }
    #printVoucherArea { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
    .no-print { display: none !important; }
}
.voucher-box { 
    border: 2px solid #0f4c3a; 
    padding: 30px; 
    background: white; 
    font-family: Arial, sans-serif; 
    color: black; 
    max-width: 800px; 
    margin: auto; 
    position: relative; 
}
.voucher-header { 
    display: flex; 
    justify-content: space-between; 
    border-bottom: 2px solid #0f4c3a; 
    padding-bottom: 10px; 
    margin-bottom: 20px; 
}
.sign-box { 
    border-top: 1px solid #000; 
    width: 150px; 
    text-align: center; 
    margin-top: 50px; 
    font-size: 12px; 
    font-weight: bold; 
    z-index: 10; 
    position: relative; 
}
/* 🖃 The Authentic Round Stamp */
.round-stamp { 
    position: absolute; 
    bottom: 80px; 
    right: 50px; 
    width: 140px; 
    height: 140px; 
    border: 5px solid #28a745; 
    border-radius: 50%; 
    color: #28a745; 
    font-size: 16px; 
    font-weight: bold; 
    text-align: center; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    transform: rotate(-15deg); 
    opacity: 0.6; 
    pointer-events: none; 
    box-shadow: inset 0 0 8px rgba(40, 167, 69, 0.5); 
    z-index: 1; 
}
.round-stamp span { 
    border-top: 2px dashed #28a745; 
    border-bottom: 2px dashed #28a745; 
    padding: 5px 0; 
    margin-top: 5px; 
    font-size: 14px; 
    letter-spacing: 1px; 
}
</style>`);

function showToast(msg) { 
    var x = document.getElementById("toast"); 
    x.innerText = msg; 
    x.style.visibility = "visible"; 
    setTimeout(() => { 
        x.style.visibility = "hidden"; 
    }, 6000); 
}

async function apiCall(action, payload = {}) {
    payload.action = action;
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();
        if(result.status === 'success') {
            return result.data;
        } else { 
            alert("Error: " + result.message); 
            return null; 
        }
    } catch (err) { 
        alert("Network Error"); 
        return null; 
    }
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

function logout() { 
    localStorage.removeItem('divineUser'); 
    window.location.href = 'index.html'; 
}

function initERP() {
    CURRENT_USER = JSON.parse(localStorage.getItem('divineUser'));
    
    if (!CURRENT_USER) { 
        window.location.href = 'index.html'; 
        return; 
    }
    
    document.getElementById('erpHeader').style.display = "flex";
    document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
    
    if(CURRENT_USER.department === 'Sales Department') {
        document.getElementById('offBtn').style.display = "block";
    }

    // 🔍 Inject Global Search Bar into Header
    let topBar = document.getElementById('erpHeader');
    if(topBar) {
        let searchHTML = `
        <div class="search-box">
            <input type="text" id="gSearch" placeholder="Search Phone/ERP/Name..." onkeypress="if(event.key === 'Enter') executeGlobalSearch()">
            <button onclick="executeGlobalSearch()" style="border:none; background:none; cursor:pointer; font-size:16px;">🔍</button>
        </div>`;
        topBar.insertAdjacentHTML('beforeend', searchHTML);
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

// ⚡ OPTIMISTIC UI: Nano-second Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    let activeBtn = document.getElementById(`nav-${tabId}`);
    if(activeBtn) {
        activeBtn.classList.add('active');
    }

    const appDiv = document.getElementById('app');
    
    // Fast render without loading screen if cache exists
    if(tabId === 'crm' && CACHE.dashboardSales) { 
        renderSalesKanban(CACHE.dashboardSales); 
    }
    else if(tabId === 'admin' && CACHE.dashboardAdmin) { 
        renderAdminCRM(CACHE.dashboardAdmin); 
    }
    else if(tabId === 'bookings' && CACHE.bookings) { 
        renderBookings(CACHE.bookings); 
    }
    else if(tabId === 'hr' && CACHE.requisitions) { 
        renderRequisitions(CACHE.requisitions); 
    }
    else { 
        appDiv.innerHTML = `<h3 style="text-align:center; padding:30px; color:#0f4c3a;">Loading ${TAB_NAMES[tabId]}...</h3>`; 
    }

    // Background Fresh Fetch
    if(tabId === 'dashboard') loadDashboardTab();
    else if(tabId === 'crm') fetchCRMTab();
    else if(tabId === 'admin') fetchAdminTab();
    else if(tabId === 'bookings') fetchBookingsTab(); 
    else if(tabId === 'hr') fetchHRTab(); 
    else if(tabId === 'reports') loadReportsTab(); 
    else if(tabId === 'finance') loadComingSoonTab("Installments");
    else if(tabId === 'commission') loadComingSoonTab("Commissions");
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
// 🔍 UNIVERSAL SMART SEARCH
// ----------------------------------------------------
async function executeGlobalSearch() {
    let query = document.getElementById('gSearch').value;
    
    if(!query || query.length < 3) {
        return showToast("Enter at least 3 characters");
    }
    
    document.getElementById('gSearch').value = "Searching...";
    
    let res = await apiCall('globalSearch', { query: query });
    document.getElementById('gSearch').value = ""; // Reset
    
    let resultHTML = `
    <div class="card" style="margin:50px auto; max-width:500px; border-top: 4px solid #0d6efd; max-height: 70vh; overflow-y:auto;">
        <h3 class="header-title">🔍 Search Results</h3>`;
    
    if(res && res.length > 0) {
        res.forEach(item => {
            let badge = item.isArchived ? `<span class="badge k-gray">🗄️ Archived</span>` : `<span class="badge k-green">🟢 Active</span>`;
            resultHTML += `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <b>${item.name}</b> ${badge}<br>
                <span style="color:#0f4c3a; font-size:12px;">📞 ${item.phone}</span> | <span style="color:#f39c12; font-size:12px;">ERP: ${item.erp || 'N/A'}</span><br>
                <small>Assigned To: <b>${item.agent}</b> | Status: <b>${item.status}</b></small>
            </div>`;
        });
    } else {
        resultHTML += `<p style="text-align:center; color:red;">No records found across active or archived data.</p>`;
    }
    
    resultHTML += `
        <button class="btn btn-gray" style="width:100%; margin-top:10px;" onclick="document.getElementById('searchModal').style.display='none'">Close</button>
    </div>`;
    
    let searchModal = document.getElementById('searchModal');
    if(!searchModal) {
        document.head.insertAdjacentHTML("beforeend", `<div id="searchModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:2000;"></div>`);
        searchModal = document.getElementById('searchModal');
    }
    searchModal.innerHTML = resultHTML;
    searchModal.style.display = 'block';
}


// ----------------------------------------------------
// 🌟 CEO DASHBOARD LOGIC (Real-time Finance Data & Graphs)
// ----------------------------------------------------
async function loadDashboardTab() {
    const appDiv = document.getElementById('app');
    
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        
        if (!CACHE.dashboardAdmin) {
            appDiv.innerHTML = `<h3 style="text-align:center; padding:30px; color:#0f4c3a;">Analyzing Company Data...</h3>`;
            let rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
            if(rawData) CACHE.dashboardAdmin = JSON.parse(rawData);
        }
        
        let d = CACHE.dashboardAdmin;

        let totalRev = d.financeStats.revenue || 0;
        let totalCol = d.financeStats.collected || 0;
        let totalExp = d.financeStats.expenses || 0;
        let totalDue = d.financeStats.due || 0;
        let bkgCount = d.financeStats.bkgCount || 0;

        // Visual Bar Calculation
        let colPct = totalRev > 0 ? Math.round((totalCol / totalRev) * 100) : 0;
        let expPct = totalCol > 0 ? Math.round((totalExp / totalCol) * 100) : 0;
        
        let topAgentsHTML = ``;
        if (d.topAgents.length > 0) {
            d.topAgents.forEach(a => {
                topAgentsHTML += `<tr><td>${a.name}</td><td>${a.sold}</td><td>৳ ${a.rev.toLocaleString()}</td></tr>`;
            });
        } else {
            topAgentsHTML = `<tr><td colspan="3" style="text-align:center;">No closed deals yet</td></tr>`;
        }

        appDiv.innerHTML = `
        <div style="padding:10px; animation: fadeIn 0.5s;">
            <h2 class="header-title" style="text-align:center; color:#0f4c3a;">👑 CEO & Executive Dashboard</h2>
            
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
                <div class="stat-box" style="flex:1; background:#e8f5e9;">
                    <div class="stat-num" style="color:#198754">${bkgCount}</div>
                    Total Deals Closed
                </div>
                <div class="stat-box" style="flex:1; background:#fff3cd;">
                    <div class="stat-num" style="color:#f39c12">৳ ${totalRev.toLocaleString()}</div>
                    Gross Revenue
                </div>
                <div class="stat-box" style="flex:1; background:#cff4fc;">
                    <div class="stat-num" style="color:#0dcaf0">৳ ${totalCol.toLocaleString()}</div>
                    Amount Collected
                </div>
                <div class="stat-box" style="flex:1; background:#f8d7da;">
                    <div class="stat-num" style="color:#dc3545">৳ ${totalDue.toLocaleString()}</div>
                    Total Outstanding Due
                </div>
            </div>

            <div style="display:flex; gap:15px; flex-wrap:wrap;">
                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #198754;">
                    <h3 class="header-title">💰 Core Financial Health</h3>
                    
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:5px;">
                        <span>Gross Revenue:</span> <b>৳ ${totalRev.toLocaleString()}</b>
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; padding-top:5px; color:green;">
                        <span>+ Total Collected:</span> <b>৳ ${totalCol.toLocaleString()}</b>
                    </div>
                    <div class="bar-wrap">
                        <div class="bar-fill" style="width:${colPct}%; background:#198754;"></div>
                    </div>
                    <small style="color:#666;">Collection Ratio: ${colPct}%</small>
                    
                    <div style="display:flex; justify-content:space-between; color:red; margin-top:10px;">
                        <span>- Total Expenses (Approved Req):</span> <b>৳ ${totalExp.toLocaleString()}</b>
                    </div>
                    <div class="bar-wrap">
                        <div class="bar-fill" style="width:${expPct}%; background:#dc3545;"></div>
                    </div>
                    <small style="color:#666;">Expense Ratio: ${expPct}% of collected</small>
                    
                    <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:18px; font-weight:bold; background:#f4f6f8; padding:8px; border-radius:5px;">
                        <span>Net Cash in Hand:</span> 
                        <span style="color:#0f4c3a;">৳ ${(totalCol - totalExp).toLocaleString()}</span>
                    </div>
                </div>

                <div class="card" style="flex:1; min-width:300px; border-left: 4px solid #0d6efd;">
                    <h3 class="header-title">🏆 Top Performing Sales Agents</h3>
                    <table class="data-table" style="width:100%; text-align:left;">
                        <thead>
                            <tr><th>Name</th><th>Sold</th><th>Revenue Generated</th></tr>
                        </thead>
                        <tbody>
                            ${topAgentsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    } else {
        if (!CACHE.dashboardSales) {
            let rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
            if (rawData) CACHE.dashboardSales = JSON.parse(rawData);
        }
        
        let leadsCount = 0; 
        let bookingCount = 0; 
        let tasksCount = 0;
        
        if(CACHE.dashboardSales && CACHE.dashboardSales.leads) {
            let leads = CACHE.dashboardSales.leads;
            leadsCount = leads.length;
            bookingCount = leads.filter(l => l.status === 'Booking').length;
            tasksCount = leads.filter(l => l.status !== 'Booking' && l.status !== 'Reject').length;
        }

        appDiv.innerHTML = `
          <div class="card" style="text-align:center;">
            <h2 class="header-title">Welcome to Divine OS, ${CURRENT_USER.name}!</h2>
            <p style="color:#666;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
          </div>
          <div class="pie-container">
            <div class="stat-box">
                <div class="stat-num" style="color:#0d6efd">${leadsCount}</div>
                Assigned Leads
            </div>
            <div class="stat-box">
                <div class="stat-num" style="color:#198754">${bookingCount}</div>
                My Bookings
            </div>
            <div class="stat-box">
                <div class="stat-num" style="color:#f39c12">${tasksCount}</div>
                Pending Tasks
            </div>
          </div>
        `;
    }
}

// ----------------------------------------------------
// 📄 REPORTS MODULE FRONTEND
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
// 📝 BOOKINGS MODULE
// ----------------------------------------------------
async function fetchBookingsTab() {
    let freshData = await apiCall('getBookings', { user: CURRENT_USER.name, role: CURRENT_USER.role, dept: CURRENT_USER.department });
    CACHE.bookings = freshData;
    renderBookings(CACHE.bookings);
}

function renderBookings(bookings) {
    if(!bookings) return;
    
    let html = `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <h3 class="header-title" style="margin:0;">📝 Bookings Management</h3>
        ${(CURRENT_USER.department === 'Sales Department' || CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect') 
            ? `<button class="btn btn-green" onclick="openBookingModal()">+ Add New Booking</button>` 
            : ''}
    </div>
    <div class="card desktop-table">
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Project</th>
                    <th>Total Price</th>
                    <th>Total Paid</th>
                    <th>Agent</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>`;
            
    if(bookings.length > 0) {
        bookings.forEach(b => {
            let actionBtn = "";
            if(CURRENT_USER.department === 'CR & Accounts' || b.agent === CURRENT_USER.name) {
                actionBtn = `<button class="btn btn-gold btn-sm" onclick="openPaymentModal('${b.id}', '${b.name}', '${b.price}', '${b.paid}')">Update Payment</button>`;
            }
            html += `
            <tr>
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
    
    // Modals
    html += `
    <div id="bookingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:500px; border-top: 4px solid #198754;">
            <h3 class="header-title">Create New Booking</h3>
            
            <label>Select Prospect</label>
            <select id="b_lead" onchange="autoFillBooking()"><option value="">Loading leads...</option></select>
            
            <input type="hidden" id="b_name">
            <input type="hidden" id="b_project">
            
            <label>Lead Type</label>
            <select id="b_type">
                <option value="SGL">SGL (Self Generated Lead) - 4%</option>
                <option value="MPL">MPL (Marketing Provided Lead) - 3%</option>
            </select>
            
            <label>Total Deal Price (Tk)</label>
            <input type="number" id="b_price">
            
            <label>Booking / Down Payment Received (Tk)</label>
            <input type="number" id="b_paid">
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:10px;" onclick="submitBooking()">Submit Booking</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeBookingModal()">Cancel</button>
        </div>
    </div>`;

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
    
    document.getElementById('app').innerHTML = html;
}

let currentSoldLeads = [];
async function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'block';
    
    if (!CACHE.soldLeads) {
        CACHE.soldLeads = await apiCall('getSoldLeads', { user: CURRENT_USER.name, role: CURRENT_USER.role });
    }
    currentSoldLeads = CACHE.soldLeads;
    
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
    let lead = currentSoldLeads.find(l => l.id === document.getElementById('b_lead').value);
    if(lead) { 
        document.getElementById('b_name').value = lead.name; 
        document.getElementById('b_project').value = lead.project; 
    }
}

function closeBookingModal() { 
    document.getElementById('bookingModal').style.display = 'none'; 
}

async function submitBooking() {
    let p = { 
        leadId: document.getElementById('b_lead').value, 
        customerName: document.getElementById('b_name').value, 
        project: document.getElementById('b_project').value, 
        totalPrice: document.getElementById('b_price').value, 
        bookingMoney: document.getElementById('b_paid').value, 
        agent: CURRENT_USER.name, 
        leadType: document.getElementById('b_type').value 
    };
    
    if(!p.leadId || !p.totalPrice || !p.bookingMoney) {
        return alert("Please fill all fields.");
    }
    
    document.querySelector('#bookingModal .btn-green').innerText = "Processing...";
    let res = await apiCall('createBooking', { data: p }); 
    showToast(res); 
    closeBookingModal(); 
    clearCache(); 
    fetchBookingsTab(); 
}

function openPaymentModal(bkgId, name, price, paid) {
    document.getElementById('p_bkgId').value = bkgId; 
    document.getElementById('p_oldPaid').value = paid;
    document.getElementById('payClientInfo').innerHTML = `Client: ${name}<br>Total Due: ৳ ${parseInt(price) - parseInt(paid)}`;
    document.getElementById('payModal').style.display = 'block';
}

async function submitPaymentUpdate() {
    let bkgId = document.getElementById('p_bkgId').value; 
    let newAmt = parseInt(document.getElementById('p_newAmt').value);
    
    if(!newAmt) return alert("Enter amount.");
    
    document.querySelector('#payModal .btn-gold').innerText = "Saving...";
    let totalPaid = parseInt(document.getElementById('p_oldPaid').value || 0) + newAmt;
    
    let res = await apiCall('updateBookingPayment', { bkgId: bkgId, totalPaid: totalPaid });
    showToast(res); 
    document.getElementById('payModal').style.display='none'; 
    clearCache(); 
    fetchBookingsTab();
}

// ----------------------------------------------------
// 🌟 SALES CRM (KANBAN BOARD WITH ACTION WINGS)
// ----------------------------------------------------
async function fetchAdminTab() {
    let rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
    if(rawData) { 
        CACHE.dashboardAdmin = JSON.parse(rawData); 
        renderAdminCRM(CACHE.dashboardAdmin); 
    }
}

async function fetchCRMTab() {
    let rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
    if(rawData) { 
        CACHE.dashboardSales = JSON.parse(rawData); 
        renderSalesKanban(CACHE.dashboardSales); 
    }
}

function renderSalesKanban(data) {
    if(data.status === 'Blocked') { 
        document.getElementById('app').innerHTML = '<h2 style="color:red;text-align:center;">🚫 BLOCKED</h2>'; 
        return; 
    }
    
    let cols = { "New": "", "Contacted": "", "Follow-up": "", "Interested": "", "Site Visit": "" };
    const today = new Date().toISOString().split('T')[0];

    data.leads.forEach(l => {
        if(cols[l.status] !== undefined) {
            let colorCls = "k-gray"; 
            let dateTxt = "No Date Set";
            if(l.nextDate) {
                dateTxt = l.nextDate;
                if(l.nextDate < today) colorCls = "k-red"; 
                else if(l.nextDate === today) colorCls = "k-yellow"; 
                else colorCls = "k-green"; 
            }
            
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
    
    html += `
    <div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #0d6efd;">
            <h3 class="header-title">Update Pipeline Stage</h3>
            <input type="hidden" id="lid">
            <label>Stage</label>
            <select id="st">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interested">Interested</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Booking">Booking (Deal Won)</option>
                <option value="Reject">Reject (Lost)</option>
            </select>
            <label>Next Follow-up Date</label>
            <input type="date" id="nxtDate">
            <label>Stage Change Remarks</label>
            <input type="text" id="rmk" placeholder="Why changing stage?">
            <div id="erpBox">
                <label>ERP ID (Mandatory for Deal)</label>
                <input id="erp" placeholder="Enter ERP ID">
            </div>
            <button class="btn btn-green" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="saveLead()">Save Update</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeModal()">Cancel</button>
        </div>
    </div>`;

    html += `
    <div id="meetingModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #f1c40f;">
            <h3 class="header-title">Schedule Meeting / Site Visit</h3>
            <input type="hidden" id="m_lid">
            <label>Prospect</label>
            <input type="text" id="m_name" readonly style="background:#eee;">
            <label>Project</label>
            <input type="text" id="m_prod" readonly style="background:#eee;">
            
            <div style="display:flex; gap:10px;">
                <div style="flex:1">
                    <label>Date</label>
                    <input type="date" id="m_date">
                </div>
                <div style="flex:1">
                    <label>Time</label>
                    <input type="time" id="m_time">
                </div>
            </div>
            <button class="btn btn-gold" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="saveMeeting()">Confirm Schedule</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('meetingModal').style.display='none'">Cancel</button>
        </div>
    </div>`;
    
    document.getElementById('app').innerHTML = html;
}

async function toggleWings(id) {
    let wing = document.getElementById(`wings_${id}`);
    if (wing.classList.contains('active')) { 
        wing.classList.remove('active'); 
        return; 
    }
    
    document.querySelectorAll('.wings-panel').forEach(p => p.classList.remove('active')); 
    wing.classList.add('active');
    
    if(!CACHE.history[id]) {
        CACHE.history[id] = await apiCall('getHistory', { id: id });
    }
    
    const h = CACHE.history[id];
    document.getElementById(`his_${id}`).innerHTML = (h && h.length > 0) ? h.map(x => `<b>${x.date}</b>: ${x.note}`).join('<br>') : "No call history found.";
}

async function saveCallNote(id) {
    let note = document.getElementById(`cn_${id}`).value; 
    if(!note) return;
    
    document.getElementById(`cn_${id}`).value = "Saving...";
    await apiCall('addCallNote', { id: id, note: note, agent: CURRENT_USER.name }); 
    showToast("Note Added!");
    
    CACHE.history[id] = null; 
    let wing = document.getElementById(`wings_${id}`); 
    wing.classList.remove('active'); 
    toggleWings(id); 
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
    await apiCall('addCallNote', { id: id, note: `🗓️ Meeting Fixed: ${date} at ${time}`, agent: CURRENT_USER.name });
    
    showToast("Meeting Scheduled!"); 
    document.getElementById('meetingModal').style.display = 'none'; 
    CACHE.history[id] = null;
}

async function openKanbanModal(id, status, date, rem, erp) { 
    document.getElementById('lid').value = id; 
    document.getElementById('st').value = status; 
    document.getElementById('nxtDate').value = date; 
    document.getElementById('rmk').value = rem; 
    document.getElementById('erp').value = erp; 
    document.getElementById('modal').style.display = 'block'; 
}

function closeModal() { 
    document.getElementById('modal').style.display = 'none'; 
}

async function saveLead() {
    let p = { 
        id: document.getElementById('lid').value, 
        agent: CURRENT_USER.name, 
        stage: document.getElementById('st').value, 
        erpId: document.getElementById('erp').value, 
        nextDate: document.getElementById('nxtDate').value, 
        remarks: document.getElementById('rmk').value 
    };
    
    if(p.stage === 'Contacted' && !p.erpId) return alert("❌ ERP ID is Required!");
    
    document.querySelector('#modal .btn-green').innerText = "Saving...";
    await apiCall('processLeadUpdate', { data: p }); 
    showToast("Update Saved!"); 
    closeModal(); 
    clearCache(); 
    fetchCRMTab();
}

// ----------------------------------------------------
// 🧾 REQUISITION MODULE (STRICT ROLE PRIVACY FIXED)
// ----------------------------------------------------
async function fetchHRTab() {
    let data = await apiCall('getRequisitions');
    CACHE.requisitions = data || [];
    renderRequisitions(CACHE.requisitions);
}

function renderRequisitions(reqs) {
    const appDiv = document.getElementById('app');
    
    // 🔒 Iron-Clad Privacy Definition
    let r_role = CURRENT_USER.role || "";
    let r_dept = CURRENT_USER.department || "";
    
    let isCEO = r_role.includes('CEO') || r_role.includes('Chief');
    let isTL = r_role.includes('Team Leader') || r_role.includes('Manager');
    let isAccounts = r_dept === 'CR & Accounts';
    let isAdmin = (r_dept === 'System Control') || (r_dept === 'Admin & HR Logistic' && (r_role.includes('Manager') || r_role.includes('Admin')));
    let isBasicUser = !isCEO && !isTL && !isAdmin && !isAccounts;

    let html = `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; border-top: 4px solid #dc3545;">
        <h3 class="header-title" style="margin:0;">🧾 Expense & Requisitions</h3>
        <button class="btn btn-red" onclick="openReqModal()">+ Create Requisition</button>
    </div>
    <div class="card desktop-table">
        <table style="font-size:12px;">
            <thead>
                <tr>
                    <th>ID & Date</th>
                    <th>Requested By</th>
                    <th>Amount & Type</th>
                    <th>Purpose & Attach</th>
                    <th>TL Auth</th>
                    <th>Admin Auth</th>
                    <th>CEO Auth</th>
                    <th>Accounts</th>
                    <th>Final Status</th>
                </tr>
            </thead>
            <tbody>`;
            
    if(reqs.length > 0) {
        reqs.forEach(r => {
            // 🔒 Execute Privacy Filters
            if (isBasicUser && r.user !== CURRENT_USER.name) return; // User sees only own
            if (isTL && r.dept !== r_dept && r.user !== CURRENT_USER.name) return; // TL sees own dept
            if (isAccounts && r.ceoApp !== 'Approved' && r.user !== CURRENT_USER.name) return; // Accounts sees approved to pay

            let btnHtml = "";
            if(isTL && r.tlApp === 'Pending') {
                btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'TL')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'TL')">Reject</button>`;
            }
            else if(isAdmin && (r.tlApp === 'Approved' || r.tlApp === 'N/A') && r.adminApp === 'Pending') {
                btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Admin')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'Admin')">Reject</button>`;
            }
            else if(isCEO && r.adminApp === 'Approved' && r.ceoApp === 'Pending') {
                btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'CEO')">Approve</button> <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}', 'CEO')">Reject</button>`;
            }
            else if(isAccounts && r.ceoApp === 'Approved' && r.accApp === 'Pending') {
                btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Accounts')">Approve/Pay</button>`;
            }
            
            if((r.finalStatus.includes('Logistic 🟢') || r.finalStatus.includes('Printed ✅')) && (isAccounts || r.user === CURRENT_USER.name || isCEO || isAdmin)) {
                btnHtml += `<br><button class="btn btn-blue btn-sm" style="margin-top:5px;" onclick="printVoucher('${r.id}')">🖨️ View Voucher</button>`;
            }

            let attachLink = r.attachment ? `<a href="${r.attachment}" target="_blank" style="color:blue;">📎 View Bill</a>` : '<small style="color:gray;">No Attach</small>';

            html += `
            <tr>
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
    } else { 
        html += `<tr><td colspan="9" style="text-align:center;">No requisitions found.</td></tr>`; 
    }
    
    html += `</tbody></table></div>`;

    html += `
    <div id="reqModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000;">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #dc3545; max-height:80vh; overflow-y:auto;">
            <h3 class="header-title">Create Requisition</h3>
            
            <label>Requisition Type</label>
            <select id="rqType"></select>
            
            <label>Amount Needed (Tk)</label>
            <input type="number" id="rqAmt" placeholder="e.g. 5000">
            
            <div style="display:flex; gap:10px;">
                <div style="flex:1">
                    <label>Expense Category</label>
                    <select id="rqCat">
                        <option>Travel & Transport</option>
                        <option>Office Supply</option>
                        <option>Marketing</option>
                        <option>Legal & Bank</option>
                    </select>
                </div>
                <div style="flex:1">
                    <label>Payment Mode</label>
                    <select id="rqMode">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Advance</option>
                    </select>
                </div>
            </div>
            
            <label>Purpose / Details</label>
            <input type="text" id="rqPur">
            
            <label>Attachment URL</label>
            <input type="text" id="rqAtt">
            
            <button class="btn btn-red" style="width:100%; margin-bottom:10px; margin-top:15px;" onclick="submitReq()">Submit Requisition</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="document.getElementById('reqModal').style.display='none'">Cancel</button>
        </div>
    </div>`;
    
    appDiv.innerHTML = html;
}

function openReqModal() {
    let dept = CURRENT_USER.department;
    let opts = "<option>Conveyance (Travel Bill)</option>"; 
    
    if(dept === 'Sales Department') {
        opts += "<option>Mobile Bill</option><option>Client Meeting Expense</option><option>Site Visit Expense</option>";
    } else if(dept === 'Marketing Department') {
        opts += "<option>Campaign Boost</option><option>Video Shoot Cost</option><option>Designer Cost</option><option>Software Subscription</option>";
    } else if(dept === 'CR & Accounts') {
        opts += "<option>Bank Charges</option><option>Document Processing</option><option>Stamp / Legal Fees</option>";
    } else if(dept === 'Admin & HR Logistic') {
        opts += "<option>Office Desk / Chair</option><option>Printer & Supply</option><option>Internet Bill</option><option>Electricity</option>";
    } else {
        opts += "<option>Stationary</option><option>Cleaning Supplies</option><option>Minor Repair</option><option>General Utility</option>";
    }
    
    document.getElementById('rqType').innerHTML = opts; 
    document.getElementById('reqModal').style.display = 'block';
}

async function submitReq() {
    let reqData = { 
        user: CURRENT_USER.name, 
        dept: CURRENT_USER.department, 
        amount: document.getElementById('rqAmt').value, 
        reqType: document.getElementById('rqType').value, 
        category: document.getElementById('rqCat').value, 
        payMode: document.getElementById('rqMode').value, 
        purpose: document.getElementById('rqPur').value, 
        attachment: document.getElementById('rqAtt').value 
    };
    
    if(!reqData.amount || !reqData.purpose) {
        return alert("Amount and Purpose are mandatory!");
    }
    
    document.querySelector('#reqModal .btn-red').innerText = "Submitting...";
    await apiCall('createRequisition', { data: reqData }); 
    showToast("Submitted!"); 
    document.getElementById('reqModal').style.display='none'; 
    clearCache(); 
    fetchHRTab();
}

async function approveReq(id, level) { 
    if(confirm(`Approve requisition?`)) { 
        await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Approved' } }); 
        showToast("Approved!"); 
        clearCache(); 
        fetchHRTab(); 
    } 
}

async function rejectReq(id, level) { 
    if(confirm(`Reject this requisition?`)) { 
        await apiCall('updateReqStatus', { data: { id: id, level: level, status: 'Rejected' } }); 
        showToast("Rejected!"); 
        clearCache(); 
        fetchHRTab(); 
    } 
}

// 🖨️ PDF Cash Voucher Print Logic (With Round Stamp)
function printVoucher(reqId) {
    let req = allRequisitions.find(r => r.id === reqId);
    if(!req) return;

    let printContent = `
    <html>
    <head><title>Voucher - ${req.id}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        .voucher-box { border: 2px solid #0f4c3a; padding: 30px; max-width: 800px; margin: auto; position: relative; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f4c3a; padding-bottom: 15px; margin-bottom: 30px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 15px; } 
        .info-table td { padding: 12px; border: 1px solid #ddd; }
        .sign-area { display: flex; justify-content: space-between; margin-top: 80px; position:relative; }
        .sign-box { text-align: center; font-size: 14px; width: 30%; z-index: 10; }
        .sign-line { border-top: 1px solid #000; margin-bottom: 5px; font-weight: bold; padding-top: 5px; }
        
        /* The Authentic Round Stamp */
        .round-stamp { 
            position: absolute; 
            bottom: 0px; 
            left: 30%; 
            width: 130px; 
            height: 130px; 
            border: 4px solid #28a745; 
            border-radius: 50%; 
            color: #28a745; 
            font-size: 14px; 
            font-weight: bold; 
            text-align: center; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            transform: rotate(-20deg); 
            opacity: 0.5; 
            z-index: 1; 
            text-transform: uppercase; 
        }
        .round-stamp span { 
            border-top: 1px dashed #28a745; 
            border-bottom: 1px dashed #28a745; 
            padding: 4px 0; 
            margin-top: 2px; 
        }
    </style></head>
    <body>
        <div class="voucher-box">
            <div class="header">
                <div>
                    <img src="https://divinegroupbd.net/images/divine-group-logo.png" width="180" alt="Divine Group">
                    <h2 style="margin: 8px 0 0 0; color: #0f4c3a;">Cash / Payment Voucher</h2>
                </div>
                <div style="text-align: right;">
                    <b>Voucher No:</b> ${req.id}<br>
                    <b>Issue Date:</b> ${new Date().toLocaleDateString()}<br>
                    <b style="color:#198754;">Status: PAID ✅</b>
                </div>
            </div>
            
            <table class="info-table">
                <tr><td width="30%"><b>Requested By:</b></td><td><b>${req.user}</b> <span style="color:#666;">(${req.dept})</span></td></tr>
                <tr><td><b>Category:</b></td><td>${req.category} - ${req.reqType}</td></tr>
                <tr><td><b>Purpose:</b></td><td>${req.purpose}</td></tr>
                <tr style="background:#f4f6f8;">
                    <td><b>Amount Approved:</b></td>
                    <td style="font-size:22px; color:#dc3545;"><b>৳ ${req.amount} /_</b> (${req.payMode})</td>
                </tr>
            </table>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 13px;">
                <b>Digital Audit Trail:</b><br>
                ✔ TL Auth: <b>${req.tlApp}</b><br>
                ✔ Admin Auth: <b>${req.adminApp}</b><br>
                ✔ CEO Auth: <b>${req.ceoApp}</b><br>
                ✔ Accounts Disbursed: <b>${req.accApp}</b>
            </div>
            
            <div class="sign-area">
                <div class="sign-box">
                    <div style="font-size:24px; color:#0f4c3a; font-family:cursive;">${req.user}</div>
                    <div class="sign-line">Prepared By</div>
                </div>
                <div class="sign-box">
                    <div style="font-size:20px; color:#d35400;">System Verified</div>
                    <div class="sign-line">Authorized Signatory</div>
                </div>
                <div class="sign-box">
                    <br><br><br>
                    <div class="sign-line">Receiver's Signature</div>
                </div>
                
                <div class="round-stamp">
                    Divine Group
                    <span>Approved &<br>Verified</span>
                    System Auto
                </div>
            </div>
        </div>
        <script>
            window.onload = function() { 
                setTimeout(() => { window.print(); }, 500); 
            }
        </script>
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
    const appDiv = document.getElementById('app');
    
    if (!CACHE.dashboardAdmin) {
        let rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
        if(rawData) CACHE.dashboardAdmin = JSON.parse(rawData);
    }
    const data = CACHE.dashboardAdmin;
    if(!data) return;

    let html = `
      <div class="card" style="background: linear-gradient(to right, #f1c40f, #f39c12); border: none;">
         <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; color:#0f4c3a;">🌴 Global Holiday Mode</h3>
            <button id="holBtn" class="btn ${data.holiday ? 'btn-red' : 'btn-green'}" onclick="toggleHoliday()">${data.holiday ? 'ON (Sleeping)' : 'OFF (Active)'}</button>
         </div>
      </div>

      <div class="card">
        <h3 class="header-title">🚀 Manual Lead Assignment</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input id="cName" placeholder="Client Name" style="flex:1">
          <input id="cPhone" placeholder="Phone" style="flex:1">
          <select id="cProd" style="flex:1">
            <option value="Cox Hotel">🏨 Cox Hotel</option>
            <option value="Purbachal Land">🏠 Purbachal Land</option>
            <option value="Commercial Space">🏢 Commercial Space</option>
          </select>
          <select id="cAgent" style="flex:1">
            <option value="Round Robin">Round Robin</option>
          </select>
          <button class="btn btn-green" onclick="addLead()">Assign Lead</button>
        </div>
      </div>
      
      <div class="card">
        <h3 class="header-title">👮 Agent Status (Access Control)</h3>
        <div id="agents">Loading...</div>
      </div>
    `;
    appDiv.innerHTML = html;

    let cAgentOpts = '<option value="Round Robin">🔄 Round Robin</option>';
    let agHtml = '<table><tr><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Action</th></tr>';
    
    data.team.forEach(a => {
        cAgentOpts += `<option value="${a.name}">${a.name}</option>`;
        let isChecked = (a.status === 'Active' || a.status === 'Visit') ? 'checked' : '';
        let statusText = (a.status === 'Visit' || a.status === 'Offline') ? '🚶 On Visit' : a.status;
        agHtml += `
        <tr>
            <td><b>${a.name}</b></td>
            <td><small>${a.dept}</small></td>
            <td><small>${a.role}</small></td>
            <td><b>${statusText}</b></td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${isChecked} onchange="toggleAgent('${a.name}')">
                    <span class="slider"></span>
                </label>
            </td>
        </tr>`;
    });
    agHtml += '</table>';
    
    document.getElementById('agents').innerHTML = agHtml;
    document.getElementById('cAgent').innerHTML = cAgentOpts;
}

function renderAdminCRM(data) {
    let stHtml = `
    <div class="card">
        <h3 class="header-title">📊 Team CRM Performance</h3>
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Agent</th>
                    <th>Total Leads</th>
                    <th>New</th>
                    <th>Contacted</th>
                    <th>Sold</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>`;
            
    for(let ag in data.stats) {
        let s = data.stats[ag];
        stHtml += `
        <tr>
            <td><b>${ag}</b></td>
            <td>${s.total}</td>
            <td>${s.new}</td>
            <td>${s.contacted}</td>
            <td><b style="color:green">${s.sold}</b></td>
            <td><b style="color:red">${s.reject}</b></td>
        </tr>`;
    }
    stHtml += '</tbody></table></div>';
    
    stHtml += `
    <div class="card">
        <h3 class="header-title">♻️ Rejected Leads Re-assign</h3>
        <div style="max-height:300px; overflow-y:auto;">
            <table class="data-table">
                <thead>
                    <tr><th>Name</th><th>Phone</th><th>Old Agent</th><th>Re-assign To</th></tr>
                </thead>
                <tbody>`;
                
    if(data.rejected.length > 0) {
        let teamOpts = '<option value="">Select Agent...</option>';
        data.team.forEach(a => { 
            teamOpts += `<option value="${a.name}">${a.name}</option>`; 
        });
        
        data.rejected.forEach(r => { 
            stHtml += `
            <tr>
                <td>${r.name}</td>
                <td>${r.phone}</td>
                <td>${r.oldAgent}</td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <select id="re_${r.id}">${teamOpts}</select>
                        <button class="btn btn-blue btn-sm" onclick="reassign('${r.id}')">Go</button>
                    </div>
                </td>
            </tr>`; 
        });
    } else { 
        stHtml += `<tr><td colspan="4" style="text-align:center;">✅ No rejected leads found.</td></tr>`; 
    }
    stHtml += `</tbody></table></div></div>`;
    
    document.getElementById('app').innerHTML += stHtml; 
}

async function goVisit() {
    const res = await apiCall('toggleSalesmanStatus', { user: CURRENT_USER.name });
    if(res === 'Visit') {
        document.getElementById('offBtn').innerText = "Return from Visit"; 
        document.getElementById('offBtn').className = "btn btn-green";
        document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role} (🚶 Visit)`;
        showToast("You are on VISIT.");
    } else {
        document.getElementById('offBtn').innerText = "Go Visit"; 
        document.getElementById('offBtn').className = "btn btn-gold";
        document.getElementById('userInfoStr').innerText = `${CURRENT_USER.department} | ${CURRENT_USER.role}`;
        showToast("Welcome Back! You are ACTIVE.");
    }
}

async function toggleAgent(name) { 
    const res = await apiCall('toggleAgentStatus', { name: name }); 
    showToast(res); 
    clearCache(); 
    loadAdminTab(); 
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
    let p = { 
        name: document.getElementById('cName').value, 
        phone: document.getElementById('cPhone').value, 
        product: document.getElementById('cProd').value, 
        agent: document.getElementById('cAgent').value 
    };
    if(!p.phone) return alert("Phone required!");
    
    const res = await apiCall('adminManualEntry', { data: p }); 
    showToast(res); 
    clearCache(); 
    loadAdminTab();
}

async function reassign(id) {
    let agent = document.getElementById('re_'+id).value; 
    if(!agent) return alert("Select an agent");
    
    const res = await apiCall('adminReassignLead', { id: id, agent: agent }); 
    showToast("Reassigned Successfully!"); 
    clearCache(); 
    loadCRMTab();
}