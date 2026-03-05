// ============================================================================
// 🌟 DIVINE OS - CORE SYSTEM CONFIGURATION
// ============================================================================
// ✅ তোমার Google Script Web App URL এখানে বসাও
const API_URL = "https://script.google.com/macros/s/AKfycbzg7wlyv4_KAqU3eQloifDnntwj4uhI8UDsbCbfSRXFFdGfjv4NLloEl5XKfZBFwBEO/exec";

let CURRENT_USER = null;

// ============================================================================
// 🎨 MULTI-THEME ENGINE (Supports up to 10+ Themes)
// ============================================================================
const themes = ['theme-original', 'theme-enterprise', 'theme-garage'];
const themeNames = ['🌱 Original Theme', '🏢 Enterprise Mode', '🏎️ Garage Mode'];
let currentThemeIdx = parseInt(localStorage.getItem('divineThemeIdx') || '0');

function applyTheme(idx) {
    // আগের সব থিম রিমুভ করে নতুনটা বসানো
    document.body.className = ''; 
    document.body.classList.add(themes[idx]);
    
    // বাটনের নাম চেঞ্জ
    let themeBtn = document.getElementById('themeBtn');
    if(themeBtn) themeBtn.innerText = themeNames[idx];
    
    localStorage.setItem('divineThemeIdx', idx);
    currentThemeIdx = idx;
}

function toggleTheme() {
    // ক্লিক করলে একটার পর একটা থিম সিরিয়াল অনুযায়ী চেঞ্জ হবে
    let nextIdx = (currentThemeIdx + 1) % themes.length;
    applyTheme(nextIdx);
}

// ============================================================================
// 🚀 SUPER FAST CACHE SYSTEM FOR INSTANT LOADING
// ============================================================================
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

// ============================================================================
// 🛡️ THE MASTER PERMISSION MATRIX (ROLE BASED ACCESS CONTROL)
// ============================================================================
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

// ============================================================================
// 🏷️ MENU LABELS DEFINITION
// ============================================================================
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

// ============================================================================
// 💅 GLOBAL CSS INJECTOR (ENTERPRISE UI, KANBAN, 360 PROFILE)
// ============================================================================
document.head.insertAdjacentHTML("beforeend", `
<style>
/* 🌍 1. Core Variables & Base Setup */
:root { 
    --primary-bg: #0f4c3a; 
    --btn-color: #198754; 
    --bg-light: #f4f7f6; /* Enterprise Very light gray background */
    --text-main: #2c3e50; 
    --text-muted: #6c757d; 
    --card-bg: #ffffff; 
    --border-soft: #eaedf1; 
}

* { 
    box-sizing: border-box; 
}

body { 
    background-color: var(--bg-light) !important; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    margin: 0; 
    padding: 0; 
}

/* 📐 2. Fluid Container System (Full Width Edge-to-Edge) */
#app { 
    width: 100%; 
    max-width: 100%; 
    padding: 30px 4vw; 
    margin: 0; 
}

/* 🏢 3. Enterprise Header & Modern Navigation */
.enterprise-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    background: #ffffff; 
    padding: 0 4vw; 
    box-shadow: 0 2px 12px rgba(0,0,0,0.04); 
    position: sticky; 
    top: 0; 
    z-index: 1000; 
    width: 100%; 
    border-bottom: 1px solid var(--border-soft);
}

.header-left { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    padding: 10px 0; 
}

.header-center { 
    flex: 1; 
    display: flex; 
    justify-content: center; 
    gap: 10px; 
}

.header-right { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    padding: 10px 0; 
}

.nav-btn { 
    background: transparent; 
    border: none; 
    border-bottom: 3px solid transparent; 
    color: var(--text-muted); 
    font-weight: 600; 
    padding: 20px 15px; 
    border-radius: 0; 
    cursor: pointer; 
    transition: all 0.2s ease; 
    font-size: 14px; 
}

.nav-btn:hover { 
    color: var(--primary-bg); 
}

.nav-btn.active { 
    border-bottom: 3px solid var(--primary-bg); 
    color: var(--primary-bg); 
    font-weight: bold; 
}

/* 📦 4. Premium Card Design (Polished with larger padding) */
.card { 
    background: var(--card-bg); 
    border-radius: 12px; 
    padding: 28px; /* Increased padding for breathing room */
    box-shadow: 0 6px 20px rgba(0,0,0,0.03); 
    border: 1px solid var(--border-soft); 
    margin-bottom: 25px; 
}

/* 🔲 5. Layout Grids */
.kpi-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px; 
    margin-bottom: 25px; 
}

.main-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 25px; 
}

/* 🔠 6. Strict Font Hierarchy (Bigger KPIs) */
.page-title { 
    font-size: 24px; 
    font-weight: 700; 
    color: var(--text-main); 
    margin-bottom: 20px; 
    margin-top: 0;
}

.card-title { 
    font-size: 16px; 
    font-weight: 700; 
    color: var(--text-main); 
    margin-bottom: 20px; 
    border-bottom: 1px solid var(--border-soft); 
    padding-bottom: 10px; 
}

.kpi-value { 
    font-size: 42px; /* Increased size */
    font-weight: 800; 
    line-height: 1.2; 
    margin-bottom: 8px; 
    color: var(--primary-bg); 
}

.kpi-label { 
    font-size: 13px; /* Slightly smaller label to emphasize number */
    color: var(--text-muted); 
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-text { 
    font-size: 13px; 
    color: var(--text-muted); 
}

/* 📊 7. Visual Progress Bars */
.bar-wrap { 
    height: 8px; 
    border-radius: 4px; 
    background: #eaedf1; 
    width: 100%; 
    overflow: hidden; 
    margin: 10px 0 20px 0; 
}

.bar-fill { 
    height: 100%; 
    border-radius: 4px; 
    transition: width 0.5s ease; 
}

/* 🔍 Smart Search Styles */
.search-box { 
    display: flex; 
    align-items: center; 
    background: #f8f9fa; 
    padding: 6px 15px; 
    border-radius: 20px; 
    border: 1px solid #ddd; 
}

.search-box input { 
    border: none; 
    outline: none; 
    background: transparent; 
    padding: 4px; 
    width: 180px; 
    font-size: 13px; 
}

/* Kanban & Wings Styles */
.kanban-board { 
    display: flex; 
    gap: 20px; 
    overflow-x: auto; 
    padding-bottom: 15px; 
}
.kanban-col { 
    background: var(--bg-light); 
    min-width: 300px; 
    border-radius: 10px; 
    padding: 15px; 
    border: 1px solid var(--border-soft); 
}
.kanban-col h4 { 
    text-align: center; 
    margin-top: 0; 
    padding-bottom: 10px; 
    border-bottom: 2px solid #ddd; 
    color: var(--text-main); 
}
.kanban-card { 
    background: white; 
    padding: 15px; 
    margin-bottom: 12px; 
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.04); 
    font-size: 13px; 
    position: relative; 
    border: 1px solid #eee; 
}
.k-red { border-left: 5px solid #dc3545; } 
.k-yellow { border-left: 5px solid #f1c40f; } 
.k-green { border-left: 5px solid #198754; } 
.k-gray { border-left: 5px solid #6c757d; }
.badge { 
    display: inline-block; 
    padding: 4px 10px; 
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

/* Modals */
.erp-modal { 
    display: none; 
    position: fixed; 
    top: 0; left: 0; 
    width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); 
    z-index: 2000; 
    backdrop-filter: blur(3px); 
}

/* Mobile Friendly Card View CSS & Grid Adjustments */
@media screen and (max-width: 1024px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .main-grid { grid-template-columns: 1fr; }
    .enterprise-header { flex-direction: column; padding: 15px; gap: 10px; }
    .header-center { width: 100%; overflow-x: auto; justify-content: flex-start; }
    .search-box input { width: 120px; }
}

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
    #app { padding: 20px 15px; }
    .kpi-grid { grid-template-columns: 1fr; }
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

/* 🔥 Custom Classes for New Dashboard Widgets & Live Monitor 🔥 */
.timeline-item { position: relative; padding-left: 20px; margin-bottom: 15px; border-left: 2px solid var(--border-soft); }
.timeline-item::before { content: ''; position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; }
.tl-green::before { background: #198754; }
.tl-yellow::before { background: #f1c40f; }
.tl-blue::before { background: #0d6efd; }
.tl-orange::before { background: #fd7e14; }
.tl-red::before { background: #dc3545; }
.funnel-stage { display: flex; justify-content: space-between; padding: 10px; background: var(--bg-light); margin-bottom: 5px; border-radius: 4px; }
.live-dot { height: 8px; width: 8px; background-color: #dc3545; border-radius: 50%; display: inline-block; animation: blink 1s infinite; margin-left: 5px; }
@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
@keyframes refreshPulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
.auto-refresh { animation: refreshPulse 10s infinite; }

/* 🍩 CSS Donut Chart for Lead Sources */
.donut-chart {
  width: 120px; height: 120px; border-radius: 50%;
  background: conic-gradient(
    #0d6efd 0% 65%, 
    #198754 65% 85%, 
    #f39c12 85% 95%, 
    #6c757d 95% 100%
  );
  display: flex; justify-content: center; align-items: center;
  position: relative; margin: 0 auto 20px auto;
}
.donut-inner {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--card-bg); display: flex; justify-content: center; align-items: center;
  flex-direction: column;
}

/* ============================================================================ */
/* 🌟 NEW: 360-DEGREE CLIENT PROFILE DRAWER (HUBSPOT / ZOHO SAAS STYLE) 🌟 */
/* ============================================================================ */
.drawer-overlay {
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 30, 45, 0.6); z-index: 2999; backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease;
}
.profile-drawer {
    position: fixed; top: 0; right: -650px; width: 100%; max-width: 550px; height: 100vh;
    background: #f4f7f6; z-index: 3000; transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: -5px 0 30px rgba(0,0,0,0.15); overflow-y: auto; display: flex; flex-direction: column;
}
.profile-drawer.open { right: 0; }
.drawer-header {
    padding: 20px 25px; background: #ffffff; border-bottom: 1px solid var(--border-soft);
    display: flex; justify-content: space-between; align-items: center;
    position: sticky; top: 0; z-index: 10;
}
.drawer-body { padding: 25px; flex: 1; }
.profile-card {
    background: #ffffff; border-radius: 10px; padding: 20px; margin-bottom: 20px;
    border: 1px solid var(--border-soft); box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.profile-avatar {
    width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary-bg) 0%, #17a2b8 100%);
    color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: bold; margin-right: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
.info-item label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 3px; letter-spacing: 0.5px;}
.info-item div { font-size: 14px; color: var(--text-main); font-weight: 600; }
.clickable-row { cursor: pointer; transition: background 0.2s ease; }
.clickable-row:hover { background: #f8f9fa; }

/* 🌟 NEW: Tabs for 360-Degree Profile 🌟 */
.profile-tabs { display: flex; border-bottom: 1px solid var(--border-soft); margin-bottom: 20px; }
.p-tab { padding: 12px 20px; cursor: pointer; border-bottom: 3px solid transparent; font-weight: bold; color: var(--text-muted); font-size:13px; transition:0.3s; }
.p-tab:hover { color: var(--primary-bg); }
.p-tab.active { border-bottom-color: var(--primary-bg); color: var(--primary-bg); }
.p-tab-content { display: none; animation: fadeIn 0.4s ease; }
.p-tab-content.active { display: block; }
</style>`);

// ============================================================================
// 🌟 360-DEGREE CLIENT PROFILE LOGIC (THE SECRET ENTERPRISE FEATURE)
// ============================================================================
function injectProfileDrawer() {
    if(document.getElementById('profileDrawer')) return; // Already injected
    
    let html = `
    <div id="drawerOverlay" class="drawer-overlay" onclick="close360Profile()"></div>
    <div id="profileDrawer" class="profile-drawer">
        <div class="drawer-header">
            <h3 style="margin:0; font-size:18px; color:var(--text-main);">🔍 Client 360° View</h3>
            <button onclick="close360Profile()" style="background:none; border:none; font-size:20px; cursor:pointer; color:var(--text-muted);">✖</button>
        </div>
        <div class="drawer-body" id="drawerBodyContent">
            </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
}

// Tab Switching Logic Inside Drawer
function switchProfileTab(tabName) {
    document.querySelectorAll('.p-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.p-tab').forEach(el => el.classList.remove('active'));
    
    document.getElementById('ptab_' + tabName).classList.add('active');
    document.getElementById('pbtn_' + tabName).classList.add('active');
}

function open360Profile(name, phone, project, status, paid, due, agent) {
    injectProfileDrawer();
    
    // Generate Initials for Avatar
    let initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    // Determine Traffic Light Status for Due Amount
    let dueAmount = parseInt(due.toString().replace(/,/g, '')) || 0;
    let dueAlertHTML = '';
    
    if(dueAmount > 0) {
        // Mock logic: randomly decide days overdue for visual demo
        let days = Math.floor(Math.random() * 15) + 1; 
        let color = days > 10 ? '#dc3545' : (days > 3 ? '#fd7e14' : '#f1c40f');
        dueAlertHTML = `
        <div style="margin-top:10px; padding:10px; background:rgba(220,53,69,0.05); border-left:3px solid ${color}; font-size:12px; font-weight:bold; color:${color};">
            ⚠ Payment is ${days} days overdue! (Follow up required)
        </div>`;
    }

    let contentHTML = `
        <div class="profile-card" style="display:flex; align-items:center;">
            <div class="profile-avatar">${initials}</div>
            <div style="flex:1;">
                <h2 style="margin:0 0 5px 0; font-size:20px; color:var(--text-main);">${name}</h2>
                <div style="font-size:13px; color:var(--text-muted);">Assigned to: <b style="color:var(--primary-bg);">${agent}</b></div>
            </div>
            <div>
                <span class="badge k-green" style="font-size:12px; padding:6px 12px;">${status}</span>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:20px;">
            <a href="tel:${phone}" class="btn btn-blue" style="flex:1; text-align:center; text-decoration:none;">📱 Call Client</a>
            <a href="https://wa.me/${phone}" target="_blank" class="btn btn-green" style="flex:1; text-align:center; text-decoration:none; background:#25D366;">💬 WhatsApp</a>
            <button class="btn btn-gold" style="flex:1;">+ Add Note</button>
        </div>

        <div class="profile-tabs">
            <div id="pbtn_overview" class="p-tab active" onclick="switchProfileTab('overview')">Overview</div>
            <div id="pbtn_financials" class="p-tab" onclick="switchProfileTab('financials')">Financials</div>
            <div id="pbtn_activity" class="p-tab" onclick="switchProfileTab('activity')">Activity Log</div>
        </div>

        <div id="ptab_overview" class="p-tab-content active">
            <div class="profile-card">
                <h3 class="card-title" style="margin-bottom:15px; border:none; padding:0;">💼 General Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Interested Project</label>
                        <div>${project}</div>
                    </div>
                    <div class="info-item">
                        <label>Lead Source</label>
                        <div>Facebook Ads</div>
                    </div>
                    <div class="info-item">
                        <label>Phone Number</label>
                        <div>${phone}</div>
                    </div>
                    <div class="info-item">
                        <label>Current Stage</label>
                        <div>${status}</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="ptab_financials" class="p-tab-content">
            <div class="profile-card">
                <h3 class="card-title" style="margin-bottom:15px; border:none; padding:0;">💵 Ledger Summary</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Total Paid</label>
                        <div style="color:#198754; font-size:18px;">৳ ${paid}</div>
                    </div>
                    <div class="info-item">
                        <label>Outstanding Due</label>
                        <div style="color:#dc3545; font-size:18px;">৳ ${due}</div>
                    </div>
                </div>
                ${dueAlertHTML}
                
                <button class="btn btn-green btn-sm" style="width:100%; margin-top:15px; padding:10px;">💳 Add Manual Payment</button>
            </div>
        </div>

        <div id="ptab_activity" class="p-tab-content">
            <div class="profile-card">
                <h3 class="card-title" style="margin-bottom:15px; border:none; padding:0;">⚡ Engagement History</h3>
                <div class="timeline-item tl-green">
                    <span class="detail-text" style="font-size:10px;">Last Week</span><br>
                    <b style="font-size:13px; color:var(--text-main);">Payment Received (৳ ${paid})</b><br>
                    <span style="font-size:11px; color:var(--text-muted);">Verified by Accounts</span>
                </div>
                <div class="timeline-item tl-blue">
                    <span class="detail-text" style="font-size:10px;">2 Weeks Ago</span><br>
                    <b style="font-size:13px; color:var(--text-main);">Site Visit Completed</b><br>
                    <span style="font-size:11px; color:var(--text-muted);">Client liked the east-facing plot.</span>
                </div>
                <div class="timeline-item tl-yellow">
                    <span class="detail-text" style="font-size:10px;">3 Weeks Ago</span><br>
                    <b style="font-size:13px; color:var(--text-main);">Initial Call</b><br>
                    <span style="font-size:11px; color:var(--text-muted);">Lead generated from Facebook Campaign.</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('drawerBodyContent').innerHTML = contentHTML;
    document.getElementById('drawerOverlay').style.display = 'block';
    setTimeout(() => { document.getElementById('profileDrawer').classList.add('open'); }, 10);
}

function close360Profile() {
    let drawer = document.getElementById('profileDrawer');
    if(drawer) {
        drawer.classList.remove('open');
        setTimeout(() => { document.getElementById('drawerOverlay').style.display = 'none'; }, 300);
    }
}

// ============================================================================
// 🔔 UTILITY FUNCTIONS
// ============================================================================
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

// ============================================================================
// LOGIN & ROUTING LOGIC
// ============================================================================
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
    
    // We overwrite the old header completely to apply Rule 6 (Left, Center, Right layout)
    let oldHeader = document.getElementById('erpHeader');
    if(oldHeader) {
        oldHeader.className = "enterprise-header";
        oldHeader.style.display = "flex";
        
        let visitBtnHTML = CURRENT_USER.department === 'Sales Department' ? `<button id="offBtn" class="btn btn-gold btn-sm" onclick="goVisit()">🚶 Visit</button>` : '';

        oldHeader.innerHTML = `
            <div class="header-left">
                <img src="https://divinegroupbd.net/images/divine-group-logo.png" style="height:35px;" alt="Logo">
                <div style="line-height:1.2;">
                    <strong style="color:var(--primary-bg); font-size:16px;">Divine OS</strong><br>
                    <small class="detail-text" id="userInfoStr">${CURRENT_USER.department} | ${CURRENT_USER.role}</small>
                </div>
            </div>
            
            <div class="header-center" id="navBarContainer">
                </div>
            
            <div class="header-right">
                <div class="search-box">
                    <input type="text" id="gSearch" placeholder="Search Data..." onkeypress="if(event.key === 'Enter') executeGlobalSearch()">
                    <button onclick="executeGlobalSearch()" style="border:none; background:none; cursor:pointer;">🔍</button>
                </div>
                ${visitBtnHTML}
                <button id="themeBtn" class="btn btn-gray btn-sm" onclick="toggleTheme()">🌱 Original Theme</button>
                <button class="btn btn-red btn-sm" onclick="logout()">Logout</button>
            </div>
        `;
    }

    // Hide old navBar block if it is floating outside
    let oldNav = document.getElementById('navBar');
    if(oldNav && oldNav.parentElement.id !== 'erpHeader') {
        oldNav.style.display = "none";
    }

    // 💡 ম্যাজিক ফিক্স: পেজ লোড হওয়ার সাথে সাথে মেমোরি থেকে সেভ করা থিমটা অ্যাপ্লাই করে দাও!
    applyTheme(currentThemeIdx); 
    
    // 🔥 ইনজেক্ট প্রোফাইল ড্রয়ার ইন বডি (For Enterprise Client View) 🔥
    injectProfileDrawer();

    renderNav(CURRENT_USER.department);
    switchTab('dashboard'); 
}

function renderNav(department) {
    const allowedModules = PERMISSIONS[department] || ["dashboard"];
    
    // Using the new container from the Enterprise Header
    const navBarContainer = document.getElementById('navBarContainer') || document.getElementById('navBar');
    if(navBarContainer) {
        navBarContainer.innerHTML = "";
        
        allowedModules.forEach(mod => {
            let btn = document.createElement("button");
            btn.className = "nav-btn"; 
            btn.id = `nav-${mod}`; 
            btn.innerText = TAB_NAMES[mod] || mod;
            btn.onclick = () => switchTab(mod); 
            navBarContainer.appendChild(btn);
        });
    }
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
        appDiv.innerHTML = `<h3 style="text-align:center; padding:50px; color:var(--text-muted);">Loading ${TAB_NAMES[tabId]}...</h3>`; 
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
    else if(tabId === 'marketing') loadMarketingTab(); 
}

function loadComingSoonTab(moduleName) {
    document.getElementById('app').innerHTML = `
      <div class="card" style="text-align:center; padding: 60px;">
        <h2 style="color:#f39c12; font-size:40px; margin:0;">🚧</h2>
        <h3 class="page-title" style="margin-top:10px;">${moduleName} Module</h3>
        <p class="detail-text">This module is currently under development. Stay tuned!</p>
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
        <h3 class="card-title">🔍 Search Results</h3>`;
    
    if(res && res.length > 0) {
        res.forEach(item => {
            let badge = item.isArchived ? `<span class="badge k-gray">🗄️ Archived</span>` : `<span class="badge k-green">🟢 Active</span>`;
            resultHTML += `
            <div style="border-bottom: 1px solid var(--border-soft); padding-bottom: 12px; margin-bottom: 12px;">
                <b style="font-size:15px; color:var(--text-main);">${item.name}</b> ${badge}<br>
                <span style="color:var(--primary-bg); font-size:12px; font-weight:bold;">📞 ${item.phone}</span> | <span style="color:#f39c12; font-size:12px; font-weight:bold;">ERP: ${item.erp || 'N/A'}</span><br>
                <div class="detail-text" style="margin-top:5px;">Assigned To: <b>${item.agent}</b> | Status: <b>${item.status}</b></div>
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
        document.head.insertAdjacentHTML("beforeend", `<div id="searchModal" class="erp-modal"></div>`);
        searchModal = document.getElementById('searchModal');
    }
    searchModal.innerHTML = resultHTML;
    searchModal.style.display = 'block';
}

// ============================================================================
// 🌟 DYNAMIC DASHBOARD ROUTER (All 10 Specialized Roles)
// ============================================================================
async function loadDashboardTab() {
    const appDiv = document.getElementById('app');
    
    // 🔥 ROUTE 1: Marketing Department (Notion+Trello+Ads Workspace)
    if (CURRENT_USER.department === 'Marketing Department') {
        loadMarketingTab();
        return;
    }
    
    // 🔥 ROUTE 5: Accounts & Finance Department (The Money Center)
    if (CURRENT_USER.department === 'CR & Accounts' && CURRENT_USER.role.includes('Account')) {
        loadAccountsTab();
        return;
    }

    // 🔥 ROUTE 6: CR Executive (Customer Relations - Recovery Engine)
    if (CURRENT_USER.department === 'CR & Accounts' && CURRENT_USER.role.includes('CR')) {
        loadCRTab();
        return;
    }
    
    // 🔥 ROUTE 7: Office Assistant / Peon (Logistics Hub)
    if (CURRENT_USER.department === 'Admin & HR Logistic' && (CURRENT_USER.role.includes('Assistant') || CURRENT_USER.role.includes('Peon'))) {
        loadOfficeAssistantTab();
        return;
    }

    // 🔥 ROUTE 8: Front Desk / Receptionist (The Reception Hub)
    if (CURRENT_USER.department === 'Admin & HR Logistic' && (CURRENT_USER.role.includes('Front Desk') || CURRENT_USER.role.includes('Receptionist') || CURRENT_USER.role.includes('Reception'))) {
        loadFrontDeskTab();
        return;
    }

    // 🔥 ROUTE 10: HR Officer (People Control Center)
    if (CURRENT_USER.department === 'Admin & HR Logistic' && CURRENT_USER.role.includes('HR')) {
        loadHROfficerTab();
        return;
    }

    // 🔥 ROUTE 9: Admin & HR Logistic -> Admin (Company Control Center)
    if (CURRENT_USER.department === 'Admin & HR Logistic' && CURRENT_USER.role.includes('Admin')) {
        loadAdminControlCenterTab();
        return;
    }
    
    // 🔥 ROUTE 2: Executive Management (MD / CEO / Strategic Control Center) 🔥
    if(CURRENT_USER.department === 'Executive Management' || CURRENT_USER.department === 'System Control') {
        
        if (!CACHE.dashboardAdmin) {
            appDiv.innerHTML = `<h3 style="text-align:center; padding:50px; color:var(--text-muted);">Analyzing Company Data...</h3>`;
            let rawData = await apiCall('getAdminData', { role: CURRENT_USER.role });
            if(rawData) {
                CACHE.dashboardAdmin = JSON.parse(rawData);
            }
        }
        
        let d = CACHE.dashboardAdmin;

        let totalRev = d.financeStats.revenue || 0;
        let totalCol = d.financeStats.collected || 0;
        let totalExp = d.financeStats.expenses || 0;
        let totalDue = d.financeStats.due || 0;
        let bkgCount = d.financeStats.bkgCount || 0;

        let topAgentsHTML = ``;
        if (d.topAgents && d.topAgents.length > 0) {
            d.topAgents.forEach(a => {
                topAgentsHTML += `
                <tr style="border-bottom:1px solid var(--border-soft);">
                    <td style="padding:12px 0; font-weight:600; color:var(--text-main);">${a.name}</td>
                    <td style="padding:12px 0;"><span class="badge k-green">${a.sold}</span></td>
                    <td style="padding:12px 0; text-align:right; font-weight:bold; color:var(--primary-bg);">৳ ${a.rev.toLocaleString()}</td>
                </tr>`;
            });
        } else {
            topAgentsHTML = `<tr><td colspan="3" style="text-align:center; padding:20px;">No closed deals yet</td></tr>`;
        }

        appDiv.innerHTML = `
        <div style="animation: fadeIn 0.5s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h2 class="page-title" style="margin:0;">👑 Executive Control Center</h2>
                    <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-gold btn-sm">✨ AI Insights</button>
                    <button class="btn btn-blue btn-sm" onclick="switchTab('reports')">📊 Master Report</button>
                </div>
            </div>

            <div style="background: linear-gradient(to right, #0f4c3a, #198754); padding: 15px 20px; border-radius: 8px; color: #fff; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(25, 135, 84, 0.2); flex-wrap:wrap; gap:15px;">
                <div style="flex:1;">
                    <b style="font-size: 14px;">🤖 AI Business Insights</b>
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">
                        <span style="margin-right: 15px;">📈 Sales increased 22% this month.</span>
                        <span style="margin-right: 15px;">📉 Marketing CPL increased by 15%.</span>
                        <span>💰 Recovery performance improved by 10%.</span>
                    </div>
                </div>
                <div style="text-align: right; border-left: 1px solid rgba(255,255,255,0.2); padding-left: 15px; min-width: 200px;">
                    <b style="font-size: 14px; color: #ffc107;">⚠️ Risk Indicators</b>
                    <div style="font-size: 12px; margin-top: 5px;">High outstanding due (৳${(totalDue/100000).toFixed(2)}L)</div>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                    <div style="display:flex; justify-content:space-between;">
                        <div class="kpi-label" style="color:#198754;">Total Revenue</div>
                        <span class="badge k-green" style="font-size:10px;">+15%</span>
                    </div>
                    <div class="kpi-value" style="color:#198754;">৳ ${(totalRev/100000).toFixed(2)}L</div>
                    <div class="bar-wrap" style="height:6px; margin:5px 0; background:#eaedf1;"><div class="bar-fill" style="width:55%; background:#198754;"></div></div>
                    <div class="detail-text" style="font-size:11px; display:flex; justify-content:space-between;"><span>Goal: 10L</span><span>55% Achieved</span></div>
                </div>
                
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                    <div class="kpi-label" style="color:#0d6efd;">Deals Closed</div>
                    <div class="kpi-value" style="color:#0d6efd;">${bkgCount}</div>
                    <div class="detail-text">Total successful bookings</div>
                </div>
                
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                    <div class="kpi-label" style="color:#f39c12;">Cash Collected</div>
                    <div class="kpi-value" style="color:#f39c12;">৳ ${(totalCol/100000).toFixed(2)}L</div>
                    <div class="detail-text">Cash received in bank</div>
                </div>
                
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                    <div class="kpi-label" style="color:#dc3545;">Outstanding Due</div>
                    <div class="kpi-value" style="color:#dc3545;">৳ ${(totalDue/100000).toFixed(2)}L</div>
                    <div class="detail-text">Pending collections</div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                    <h3 class="card-title">🚨 Strategic Alerts (Action Required)</h3>
                    <div style="background:rgba(220, 53, 69, 0.1); padding:12px; border-radius:6px; margin-bottom:10px; color:#dc3545; font-weight:600; border-left:4px solid #dc3545; display:flex; justify-content:space-between; align-items:center;">
                        <span>⚠ 12 Installments Overdue</span> <button class="btn btn-red btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;">View Details</button>
                    </div>
                    <div style="background:rgba(241, 196, 15, 0.1); padding:12px; border-radius:6px; margin-bottom:10px; color:#b8860b; font-weight:600; border-left:4px solid #f1c40f; display:flex; justify-content:space-between; align-items:center;">
                        <span>🧾 3 Large Requisitions Pending</span> <button class="btn btn-gold btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;" onclick="switchTab('hr')">Review</button>
                    </div>
                    <div style="background:rgba(108, 117, 125, 0.1); padding:12px; border-radius:6px; color:#6c757d; font-weight:600; border-left:4px solid #6c757d; display:flex; justify-content:space-between; align-items:center;">
                        <span>📉 Low Performing Campaign Detected</span> <button class="btn btn-gray btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;">Assign</button>
                    </div>
                </div>

                <div class="card" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h3 class="card-title" style="margin:0; border:none;">📈 Company Revenue Trend (Q1)</h3>
                        <span class="badge k-green">Upward</span>
                    </div>
                    <div style="display:flex; align-items:flex-end; gap:15px; height:120px; padding-top:10px; border-bottom:2px solid var(--border-soft);">
                        <div style="flex:1; background:var(--border-soft); height:40%; border-radius:4px 4px 0 0; position:relative; transition:0.3s; cursor:pointer;" title="Jan: 3.2L">
                            <span style="position:absolute; bottom:-22px; left:50%; transform:translateX(-50%); font-size:11px; font-weight:bold; color:var(--text-muted);">JAN</span>
                        </div>
                        <div style="flex:1; background:var(--btn-color); height:65%; border-radius:4px 4px 0 0; position:relative; transition:0.3s; cursor:pointer;" title="Feb: 4.8L">
                            <span style="position:absolute; bottom:-22px; left:50%; transform:translateX(-50%); font-size:11px; font-weight:bold; color:var(--text-muted);">FEB</span>
                        </div>
                        <div style="flex:1; background:var(--primary-bg); height:95%; border-radius:4px 4px 0 0; position:relative; transition:0.3s; cursor:pointer;" title="Mar: 5.50L">
                            <span style="position:absolute; bottom:-22px; left:50%; transform:translateX(-50%); font-size:11px; font-weight:bold; color:var(--text-muted);">MAR</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">🏢 Department Performance</h3>
                    <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                        <tbody>
                            <tr style="border-bottom:1px solid var(--border-soft);">
                                <td style="padding:10px 0;"><b>Sales</b></td>
                                <td style="padding:10px 0; text-align:right;"><span class="badge k-blue">12 Deals Closed</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--border-soft);">
                                <td style="padding:10px 0;"><b>Marketing</b></td>
                                <td style="padding:10px 0; text-align:right;"><span class="badge k-green">120 Leads Gen.</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--border-soft);">
                                <td style="padding:10px 0;"><b>Accounts</b></td>
                                <td style="padding:10px 0; text-align:right;"><span class="badge k-yellow">8 Payments Proc.</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--border-soft);">
                                <td style="padding:10px 0;"><b>CR & Recovery</b></td>
                                <td style="padding:10px 0; text-align:right;"><span class="badge k-red">4 Overdue Rec.</span></td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;"><b>HR & Admin</b></td>
                                <td style="padding:10px 0; text-align:right;"><span class="badge k-gray">2 New Hires</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="card" style="margin-bottom:0; background:linear-gradient(135deg, var(--card-bg) 0%, rgba(13, 110, 253, 0.05) 100%);">
                    <h3 class="card-title">🏦 Financial Health Panel</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px;">
                        <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid var(--border-soft); box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:bold; text-transform:uppercase;">Bank Balance</div>
                            <div style="font-size:18px; color:#0d6efd; font-weight:bold;">৳ 8.50L</div>
                        </div>
                        <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid var(--border-soft); box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:bold; text-transform:uppercase;">Accounts Receivable</div>
                            <div style="font-size:18px; color:#198754; font-weight:bold;">৳ 5.20L</div>
                        </div>
                        <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid var(--border-soft); box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:bold; text-transform:uppercase;">Monthly Expenses</div>
                            <div style="font-size:18px; color:#dc3545; font-weight:bold;">৳ ${(totalExp/100000).toFixed(2)}L</div>
                        </div>
                        <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid var(--border-soft); box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                            <div style="font-size:11px; color:var(--text-muted); font-weight:bold; text-transform:uppercase;">Net Profit (Est.)</div>
                            <div style="font-size:18px; color:#f39c12; font-weight:bold;">৳ 3.40L</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">📊 Lead Funnel Overview</h3>
                    <div style="display:flex; gap:5px; text-align:center; overflow-x:auto; padding-bottom:10px;">
                        <div style="flex:1; min-width:70px; background:rgba(13, 110, 253, 0.1); border:1px solid #0d6efd; padding:10px; border-radius:6px;">
                            <b style="font-size:18px; color:#0d6efd;">120</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Leads</span>
                        </div>
                        <div style="flex:1; min-width:70px; background:rgba(23, 162, 184, 0.1); border:1px solid #17a2b8; padding:10px; border-radius:6px;">
                            <b style="font-size:18px; color:#17a2b8;">90</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Contacted</span>
                        </div>
                        <div style="flex:1; min-width:70px; background:rgba(241, 196, 15, 0.1); border:1px solid #f1c40f; padding:10px; border-radius:6px;">
                            <b style="font-size:18px; color:#f39c12;">40</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Visits</span>
                        </div>
                        <div style="flex:1; min-width:70px; background:rgba(253, 126, 20, 0.1); border:1px solid #fd7e14; padding:10px; border-radius:6px;">
                            <b style="font-size:18px; color:#fd7e14;">18</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Negotiation</span>
                        </div>
                        <div style="flex:1; min-width:70px; background:rgba(25, 135, 84, 0.1); border:1px solid #198754; padding:10px; border-radius:6px;">
                            <b style="font-size:18px; color:#198754;">${bkgCount}</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Closed</span>
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">🏆 Top Performing Agents</h3>
                    <table style="width:100%; text-align:left; border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border-soft); color:var(--text-muted); font-size:13px;">
                                <th style="padding-bottom:10px;">Agent Name</th>
                                <th style="padding-bottom:10px;">Deals Won</th>
                                <th style="padding-bottom:10px; text-align:right;">Revenue Gen.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topAgentsHTML}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="main-grid">
                <div class="card" style="margin-bottom:0; border-top: 4px solid #198754;">
                    <h3 class="card-title">🔮 Cash Flow Forecast</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8f9fa; border-radius:6px; margin-bottom:10px;">
                        <span style="font-weight:bold; color:var(--text-main); font-size:13px;">Expected Collection (This Month)</span>
                        <span style="font-weight:bold; color:#198754; font-size:15px;">৳ 6.50L</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8f9fa; border-radius:6px; margin-bottom:10px;">
                        <span style="font-weight:bold; color:var(--text-main); font-size:13px;">Expected Expenses</span>
                        <span style="font-weight:bold; color:#dc3545; font-size:15px;">৳ 2.80L</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(25, 135, 84, 0.1); border-left:4px solid #198754; border-radius:6px;">
                        <span style="font-weight:bold; color:var(--primary-bg); font-size:14px;">Projected Profit</span>
                        <span style="font-weight:bold; color:#198754; font-size:18px;">৳ 3.70L</span>
                    </div>
                </div>
                
                <div class="card" style="margin-bottom:0; border-top: 4px solid #f39c12;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h3 class="card-title" style="margin:0; border:none;">✅ Executive Approval Center</h3>
                        <span class="badge k-yellow">3 Pending</span>
                    </div>
                    <div style="height: 150px; overflow-y: auto; padding-right: 5px;">
                        <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <b style="font-size:13px; color:var(--text-main);">Marketing Budget (Q2)</b>
                                <span style="font-size:12px; color:#dc3545; font-weight:bold;">৳ 2,50,000</span>
                            </div>
                            <div style="display:flex; gap:5px;">
                                <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">Approve</button>
                                <button class="btn btn-gray btn-sm" style="flex:1; font-size:11px; padding:4px;" onclick="switchTab('hr')">Review</button>
                            </div>
                        </div>
                        <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <b style="font-size:13px; color:var(--text-main);">Commission - Mutakkin</b>
                                <span style="font-size:12px; color:#f39c12; font-weight:bold;">৳ 15,000</span>
                            </div>
                            <div style="display:flex; gap:5px;">
                                <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">Approve</button>
                                <button class="btn btn-gray btn-sm" style="flex:1; font-size:11px; padding:4px;">Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>`;
    } 
    // 🔥 ROUTE 3: Sales Team Leader Dashboard
    else if(CURRENT_USER.role.includes('Team Leader') || CURRENT_USER.role.includes('Manager')) {
        
        if (!CACHE.dashboardSales) {
            let rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
            if (rawData) {
                CACHE.dashboardSales = JSON.parse(rawData);
            }
        }
        
        // Mock data for TL
        let teamLeadsToday = 28;
        let totalAssigned = 140;
        let teamBookings = 6;
        let pendingFollowups = 22;

        appDiv.innerHTML = `
        <div style="animation: fadeIn 0.5s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h2 class="page-title" style="margin:0;">Welcome back, ${CURRENT_USER.name}!</h2>
                    <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-green btn-sm" onclick="switchTab('crm')">+ Add Lead</button>
                    <button class="btn btn-blue btn-sm" onclick="switchTab('crm')">Reassign Lead</button>
                    <button class="btn btn-gold btn-sm">Schedule Visit</button>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                    <div class="kpi-label" style="color:#0d6efd;">Team Leads Today</div>
                    <div class="kpi-value" style="color:#0d6efd">${teamLeadsToday}</div>
                    <div class="detail-text">New leads assigned to team</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #17a2b8;">
                    <div class="kpi-label" style="color:#17a2b8;">Total Assigned Leads</div>
                    <div class="kpi-value" style="color:#17a2b8">${totalAssigned}</div>
                    <div class="detail-text">Active pipeline size</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid var(--btn-color);">
                    <div class="kpi-label" style="color:var(--btn-color);">Team Bookings</div>
                    <div class="kpi-value" style="color:var(--btn-color)">${teamBookings}</div>
                    <div class="detail-text">Total deals closed</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                    <div class="kpi-label" style="color:#dc3545;">Pending Follow-ups</div>
                    <div class="kpi-value" style="color:#dc3545">${pendingFollowups}</div>
                    <div class="detail-text">Requires immediate action</div>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 class="card-title" style="margin:0; border:none;">📊 Team Sales Pipeline</h3>
                    <button class="btn btn-gray btn-sm" onclick="switchTab('crm')">View Full Board</button>
                </div>
                <div style="display:flex; gap:10px; margin-top:15px; text-align:center;">
                    <div style="flex:1; background:rgba(13, 110, 253, 0.1); border:1px solid #0d6efd; padding:15px; border-radius:8px;">
                        <b style="font-size:24px; color:#0d6efd;">45</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">New Leads</span>
                    </div>
                    <div style="flex:1; background:rgba(23, 162, 184, 0.1); border:1px solid #17a2b8; padding:15px; border-radius:8px;">
                        <b style="font-size:24px; color:#17a2b8;">60</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Contacted</span>
                    </div>
                    <div style="flex:1; background:rgba(241, 196, 15, 0.1); border:1px solid #f1c40f; padding:15px; border-radius:8px;">
                        <b style="font-size:24px; color:#f39c12;">20</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Site Visit</span>
                    </div>
                    <div style="flex:1; background:rgba(220, 53, 69, 0.1); border:1px solid #dc3545; padding:15px; border-radius:8px;">
                        <b style="font-size:24px; color:#dc3545;">9</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Negotiation</span>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px; overflow-x:auto;">
                <h3 class="card-title">🏆 Team Performance Monitoring</h3>
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <th style="padding-bottom:10px;">Sales Agent</th>
                            <th style="padding-bottom:10px;">Total Leads</th>
                            <th style="padding-bottom:10px;">Site Visits</th>
                            <th style="padding-bottom:10px;">Bookings</th>
                            <th style="padding-bottom:10px;">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Hasan (You)</td>
                            <td style="padding:12px 0;">20</td>
                            <td style="padding:12px 0;">10</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">2</td>
                            <td style="padding:12px 0;"><span class="badge k-green">10%</span></td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Mutakkin</td>
                            <td style="padding:12px 0;">18</td>
                            <td style="padding:12px 0;">7</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">1</td>
                            <td style="padding:12px 0;"><span class="badge k-yellow">5.5%</span></td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Rakib</td>
                            <td style="padding:12px 0;">22</td>
                            <td style="padding:12px 0;">12</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">3</td>
                            <td style="padding:12px 0;"><span class="badge k-green">13.6%</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                    <h3 class="card-title">🚨 Zero Leakage Alerts (Fix Follow-ups)</h3>
                    <div style="background:rgba(220, 53, 69, 0.1); padding:12px; border-radius:6px; margin-bottom:10px; color:#dc3545; font-weight:600; border-left:4px solid #dc3545; display:flex; justify-content:space-between; align-items:center;">
                        <span>⚠ 5 Leads Not Contacted (Over 24h)</span> <button class="btn btn-red btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;" onclick="switchTab('crm')">Push Team</button>
                    </div>
                    <div style="background:rgba(241, 196, 15, 0.1); padding:12px; border-radius:6px; margin-bottom:10px; color:#b8860b; font-weight:600; border-left:4px solid #f1c40f; display:flex; justify-content:space-between; align-items:center;">
                        <span>⚠ 3 Site Visits Pending Update</span> <button class="btn btn-gold btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;">Check</button>
                    </div>
                    <div style="background:rgba(108, 117, 125, 0.1); padding:12px; border-radius:6px; color:#6c757d; font-weight:600; border-left:4px solid #6c757d; display:flex; justify-content:space-between; align-items:center;">
                        <span>⚠ 2 Negotiations Delayed</span> <button class="btn btn-gray btn-sm" style="padding:4px 10px; font-size:11px; border-radius:4px;">Intervene</button>
                    </div>
                </div>

                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">📅 Upcoming Site Visits</h3>
                    <div style="border-left: 2px solid #0d6efd; padding-left: 15px; margin-bottom: 15px;">
                        <span class="detail-text" style="font-size:11px; font-weight:bold;">Tomorrow, 10:00 AM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Rahim Uddin</b> (Plot A12)<br>
                        <span style="font-size:12px; color:var(--text-muted);">Assigned to: Hasan</span>
                    </div>
                    <div style="border-left: 2px solid #198754; padding-left: 15px;">
                        <span class="detail-text" style="font-size:11px; font-weight:bold;">26 March, 03:00 PM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Shafiqul Islam</b> (Cox Holiday Inn)<br>
                        <span style="font-size:12px; color:var(--text-muted);">Assigned to: Rakib</span>
                    </div>
                </div>
            </div>

            <div class="main-grid">
                <div class="card auto-refresh" style="margin-bottom:0; border-top: 4px solid #f39c12;">
                    <h3 class="card-title">🔄 Lead Distribution Monitor <span class="live-dot"></span></h3>
                    <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                        <div class="timeline-item tl-blue">
                            <span class="detail-text" style="font-size:10px;">3 mins ago</span><br>
                            <b style="font-size:13px; color:var(--text-main);">Lead: Rahim (FB Ads)</b><br>
                            <span style="font-size:11px; color:#198754; font-weight:bold;">➔ Auto Assigned: Mutakkin</span>
                        </div>
                        <div class="timeline-item tl-green">
                            <span class="detail-text" style="font-size:10px;">15 mins ago</span><br>
                            <b style="font-size:13px; color:var(--text-main);">Lead: Karim (Website)</b><br>
                            <span style="font-size:11px; color:#198754; font-weight:bold;">➔ Auto Assigned: Rakib</span>
                        </div>
                        <div class="timeline-item tl-yellow">
                            <span class="detail-text" style="font-size:10px;">1 hour ago</span><br>
                            <b style="font-size:13px; color:var(--text-main);">Lead: Jamil (Google Ads)</b><br>
                            <span style="font-size:11px; color:#f1c40f; font-weight:bold;">➔ Manual Assigned: Hasan</span>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-bottom:0; background:linear-gradient(135deg, var(--card-bg) 0%, rgba(241, 196, 15, 0.05) 100%);">
                    <h3 class="card-title">💸 Commission Preview (Team)</h3>
                    <div style="text-align:center; padding:15px 0; border-bottom:1px solid var(--border-soft);">
                        <div class="detail-text" style="text-transform:uppercase; font-weight:bold; letter-spacing:1px; margin-bottom:5px;">Total Team Commission Gen.</div>
                        <b style="font-size:36px; color:#198754; font-weight:900;">৳ 45,000</b>
                    </div>
                    <div style="text-align:center; padding-top:15px;">
                        <div class="detail-text" style="margin-bottom:5px;">Your Personal Override/Commission</div>
                        <b style="font-size:24px; color:#f39c12;">৳ 8,500</b>
                    </div>
                </div>
            </div>
        </div>`;
    }
    // 🔥 ROUTE 4: Regular Sales Agent (The Gamified Conversion Engine) 🔥
    else {
        if (!CACHE.dashboardSales) {
            let rawData = await apiCall('getSalesmanData', { user: CURRENT_USER.name });
            if (rawData) {
                CACHE.dashboardSales = JSON.parse(rawData);
            }
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
        <div style="animation: fadeIn 0.5s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h2 class="page-title" style="margin:0;">Welcome back, ${CURRENT_USER.name}! 🚀</h2>
                    <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="btn btn-green btn-sm" onclick="switchTab('crm')">➕ Add Lead</button>
                    <button class="btn btn-blue btn-sm" onclick="switchTab('crm')">📞 Add Follow-up</button>
                    <button class="btn btn-gold btn-sm" onclick="switchTab('crm')">📅 Schedule Visit</button>
                </div>
            </div>

            <div style="background:rgba(220, 53, 69, 0.05); border-left:4px solid #dc3545; padding:10px 15px; border-radius:6px; margin-bottom:20px; display:flex; gap:15px;">
                <span style="color:#dc3545; font-size:12px; font-weight:bold;">⚠ Leads not contacted (24h): 3</span>
                <span style="color:#f39c12; font-size:12px; font-weight:bold;">⚠ Visit not updated: 2</span>
            </div>

            <div class="kpi-grid">
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                    <div class="kpi-label" style="color:#0d6efd;">Total Pipeline</div>
                    <div class="kpi-value" style="color:#0d6efd">${leadsCount}</div>
                    <div class="detail-text">Active leads assigned to you</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                    <div class="kpi-label" style="color:#198754;">Monthly Target</div>
                    <div class="kpi-value" style="color:#198754">${bookingCount} <span style="font-size:18px; color:var(--text-muted);">/ 5</span></div>
                    <div class="detail-text">Deals closed this month</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f1c40f;">
                    <div class="kpi-label" style="color:#f39c12;">Pending Tasks</div>
                    <div class="kpi-value" style="color:#f39c12">${tasksCount}</div>
                    <div class="detail-text">Follow-ups & visits</div>
                </div>
                <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                    <div class="kpi-label" style="color:#dc3545;">Hot Leads</div>
                    <div class="kpi-value" style="color:#dc3545">3</div>
                    <div class="detail-text">High probability to close</div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h3 class="card-title" style="margin:0; border:none;">🔥 My Hot Leads (Priority)</h3>
                        <span class="badge k-red">Action Needed</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div class="clickable-row" style="padding:12px; background:rgba(220, 53, 69, 0.05); border-left:3px solid #dc3545; border-radius:4px;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Negotiation', '0', '12,50,000', '${CURRENT_USER.name}')">
                            <div style="display:flex; justify-content:space-between;">
                                <b style="font-size:14px; color:var(--text-main);">Rahim Uddin</b>
                                <span style="font-size:11px; color:#dc3545; font-weight:bold;">Negotiation</span>
                            </div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Project: Plot A12 | ৳ 12,50,000</div>
                            <button class="btn btn-red btn-sm" style="margin-top:8px; width:100%; font-size:11px;" onclick="event.stopPropagation(); switchTab('crm')">Close Deal Now</button>
                        </div>
                        <div class="clickable-row" style="padding:12px; background:rgba(241, 196, 15, 0.05); border-left:3px solid #f1c40f; border-radius:4px;" onclick="open360Profile('Shafiqul Islam', '01800000000', 'Cox Holiday Inn', 'Site Visit', '0', '0', '${CURRENT_USER.name}')">
                            <div style="display:flex; justify-content:space-between;">
                                <b style="font-size:14px; color:var(--text-main);">Shafiqul Islam</b>
                                <span style="font-size:11px; color:#f39c12; font-weight:bold;">Site Visit</span>
                            </div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Project: Cox Holiday Inn | Tomorrow, 11 AM</div>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h3 class="card-title" style="margin:0; border:none;">📞 Today's Call List</h3>
                        <span class="badge k-blue" style="background:#0d6efd; color:#fff;">${tasksCount} Calls</span>
                    </div>
                    <div style="height: 200px; overflow-y: auto; padding-right: 5px;">
                        <label style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid var(--border-soft); cursor:pointer;">
                            <input type="checkbox" style="width:16px; height:16px;">
                            <div style="flex:1;" onclick="open360Profile('Jamil Hossain', '01711000000', 'Pending', 'Follow-up', '0', '0', '${CURRENT_USER.name}')">
                                <b style="font-size:13px; color:var(--text-main);">Jamil Hossain</b><br>
                                <span style="font-size:11px; color:var(--text-muted);">Follow-up (10:00 AM)</span>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <a href="tel:01711000000" style="text-decoration:none; font-size:16px;" title="Direct Call">📱</a>
                                <a href="https://wa.me/01711000000" target="_blank" style="text-decoration:none; font-size:16px;" title="WhatsApp">💬</a>
                            </div>
                        </label>
                        <label style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid var(--border-soft); cursor:pointer;">
                            <input type="checkbox" style="width:16px; height:16px;">
                            <div style="flex:1;" onclick="open360Profile('Karim Bhai', '01811000000', 'Commercial Space', 'New Lead', '0', '0', '${CURRENT_USER.name}')">
                                <b style="font-size:13px; color:var(--text-main);">Karim Bhai</b><br>
                                <span style="font-size:11px; color:var(--text-muted);">New Lead (12:30 PM)</span>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <a href="tel:01811000000" style="text-decoration:none; font-size:16px;">📱</a>
                                <a href="https://wa.me/01811000000" target="_blank" style="text-decoration:none; font-size:16px;">💬</a>
                            </div>
                        </label>
                        <label style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid var(--border-soft); cursor:pointer; opacity:0.6;">
                            <input type="checkbox" checked style="width:16px; height:16px;">
                            <div style="flex:1; text-decoration:line-through;">
                                <b style="font-size:13px; color:var(--text-main);">Nusrat Jahan</b><br>
                                <span style="font-size:11px; color:var(--text-muted);">Contacted (09:00 AM)</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">📊 Visual Sales Pipeline</h3>
                    <div style="display:flex; gap:5px; text-align:center; overflow-x:auto; padding-bottom:10px;">
                        <div style="flex:1; min-width:80px; background:rgba(13, 110, 253, 0.1); border:1px solid #0d6efd; padding:10px; border-radius:6px;">
                            <b style="font-size:20px; color:#0d6efd;">12</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">New</span>
                        </div>
                        <div style="flex:1; min-width:80px; background:rgba(23, 162, 184, 0.1); border:1px solid #17a2b8; padding:10px; border-radius:6px;">
                            <b style="font-size:20px; color:#17a2b8;">18</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Contacted</span>
                        </div>
                        <div style="flex:1; min-width:80px; background:rgba(241, 196, 15, 0.1); border:1px solid #f1c40f; padding:10px; border-radius:6px;">
                            <b style="font-size:20px; color:#f39c12;">7</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Visit</span>
                        </div>
                        <div style="flex:1; min-width:80px; background:rgba(220, 53, 69, 0.1); border:1px solid #dc3545; padding:10px; border-radius:6px;">
                            <b style="font-size:20px; color:#dc3545;">5</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Negotiation</span>
                        </div>
                        <div style="flex:1; min-width:80px; background:rgba(25, 135, 84, 0.1); border:1px solid #198754; padding:10px; border-radius:6px;">
                            <b style="font-size:20px; color:#198754;">${bookingCount}</b><br><span style="font-size:11px; font-weight:bold; color:var(--text-main);">Closed</span>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:15px;">
                        <div style="flex:1; min-width:120px;">
                            <h3 class="card-title">📈 Conversion Rate</h3>
                            <b style="font-size:32px; color:#198754;">6.6%</b>
                            <div class="detail-text" style="margin-top:5px;">Total Leads: ${leadsCount} <br> Bookings: ${bookingCount}</div>
                        </div>
                        <div style="flex:1; min-width:120px; border-left:1px solid var(--border-soft); padding-left:15px;">
                            <h3 class="card-title" style="margin-bottom:10px; border:none; padding:0;">🌐 My Sources</h3>
                            <div style="font-size:12px; color:var(--text-main); line-height:1.8;">
                                <div><span style="color:#0d6efd; font-size:14px;">●</span> Facebook: <b>20</b></div>
                                <div><span style="color:#f39c12; font-size:14px;">●</span> Google: <b>10</b></div>
                                <div><span style="color:#198754; font-size:14px;">●</span> Website: <b>8</b></div>
                                <div><span style="color:#6c757d; font-size:14px;">●</span> Referral: <b>7</b></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-grid" style="margin-bottom: 24px;">
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">📅 Upcoming Visits</h3>
                    <div class="clickable-row" style="border-left: 2px solid #0d6efd; padding-left: 15px; margin-bottom: 15px;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Negotiation', '0', '12,50,000', '${CURRENT_USER.name}')">
                        <span class="detail-text" style="font-size:11px; font-weight:bold;">Tomorrow, 10:00 AM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Rahim Uddin</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">Project: Plot A12</span>
                    </div>
                    <div class="clickable-row" style="border-left: 2px solid #198754; padding-left: 15px;" onclick="open360Profile('Karim', '01800000000', 'Plot B4', 'Site Visit', '0', '0', '${CURRENT_USER.name}')">
                        <span class="detail-text" style="font-size:11px; font-weight:bold;">Friday, 03:00 PM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Karim</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">Project: Plot B4</span>
                    </div>
                </div>
                
                <div class="card" style="margin-bottom:0;">
                    <h3 class="card-title">⚡ My Recent Activities</h3>
                    <div style="height: 150px; overflow-y: auto; padding-right: 10px;">
                        <div class="timeline-item tl-green">
                            <b style="font-size:13px; color:var(--text-main);">Closed Deal</b> (Plot A12)<br>
                            <span class="detail-text" style="font-size:10px;">2 hours ago</span>
                        </div>
                        <div class="timeline-item tl-blue">
                            <b style="font-size:13px; color:var(--text-main);">Updated Lead Stage</b> (Negotiation)<br>
                            <span class="detail-text" style="font-size:10px;">4 hours ago</span>
                        </div>
                        <div class="timeline-item tl-yellow">
                            <b style="font-size:13px; color:var(--text-main);">Scheduled Visit</b> (Karim - Friday)<br>
                            <span class="detail-text" style="font-size:10px;">5 hours ago</span>
                        </div>
                        <div class="timeline-item tl-red">
                            <b style="font-size:13px; color:var(--text-main);">Called Rahim</b><br>
                            <span class="detail-text" style="font-size:10px;">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-grid">
                <div class="card" style="margin-bottom:0; background:linear-gradient(135deg, var(--card-bg) 0%, rgba(25, 135, 84, 0.05) 100%); border-top: 4px solid #198754;">
                    <h3 class="card-title">💰 Commission & Earnings</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <div>
                            <div class="detail-text" style="font-weight:bold; margin-bottom:5px;">Expected Commission</div>
                            <b style="font-size:22px; color:var(--text-muted);">৳ 45,000</b>
                        </div>
                        <div style="text-align:right;">
                            <div class="detail-text" style="font-weight:bold; color:#198754; margin-bottom:5px;">Earned This Month</div>
                            <b style="font-size:28px; color:#198754;">৳ 12,500</b>
                        </div>
                    </div>
                    <div class="bar-wrap" style="height:12px; background:rgba(25,135,84,0.2);">
                        <div class="bar-fill" style="width:27%; background:#198754;"></div>
                    </div>
                    <div class="detail-text" style="text-align:right; margin-top:5px; font-weight:bold;">27% of Goal Achieved</div>
                </div>

                <div class="card" style="margin-bottom:0; border-top: 4px solid #f1c40f;">
                    <h3 class="card-title">🏆 Live Team Ranking</h3>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(241, 196, 15, 0.1); border-radius:6px; border:1px solid #f1c40f;">
                            <div><b style="font-size:16px;">🥇</b> <span style="font-weight:bold; color:var(--text-main); margin-left:5px;">Mutakkin</span></div>
                            <span style="font-size:13px; font-weight:bold; color:#f39c12;">4 Deals</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-light); border-radius:6px;">
                            <div><b style="font-size:16px; color:#95a5a6;">🥈</b> <span style="font-weight:bold; color:var(--text-main); margin-left:5px;">Rakib</span></div>
                            <span style="font-size:13px; font-weight:bold; color:var(--text-muted);">3 Deals</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--card-bg); border-radius:6px; border:1px dashed var(--btn-color); box-shadow:0 0 10px rgba(25,135,84,0.1);">
                            <div><b style="font-size:16px; color:#d35400;">🥉</b> <span style="font-weight:bold; color:var(--btn-color); margin-left:5px;">${CURRENT_USER.name} (You)</span></div>
                            <span style="font-size:13px; font-weight:bold; color:var(--btn-color);">${bookingCount} Deals</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

// ----------------------------------------------------
// 🎯 THE ULTIMATE SAAS MARKETING DASHBOARD (Trello + Notion Style)
// ----------------------------------------------------
function loadMarketingTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <h2 class="page-title" style="margin:0;">🚀 Marketing Control Center</h2>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-gold btn-sm">+ Create Campaign</button>
                <button class="btn btn-green btn-sm">+ Add Lead</button>
                <button class="btn btn-blue btn-sm">🔄 Manual Assign</button>
            </div>
        </div>

        <div class="card" style="padding:15px; border-left: 4px solid #dc3545; display:flex; justify-content:space-between; align-items:center; background:rgba(220, 53, 69, 0.05); margin-bottom:25px;">
            <div style="display:flex; gap:20px;">
                <span style="font-weight:bold; color:#dc3545; font-size:13px;">⚠ CPL Exceeded ৳500 (Google Purbachal)</span>
                <span style="font-weight:bold; color:#f39c12; font-size:13px;">⚠ Budget Limit Reached (FB Tangua Haor)</span>
            </div>
            <button class="btn btn-red btn-sm" style="padding:5px 10px; font-size:11px;">Fix Issues</button>
        </div>
        
        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">Today Leads (Blue)</div>
                <div class="kpi-value" style="color:#0d6efd">24</div>
                <div class="detail-text">Fresh incoming leads</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Revenue Gen. (Green)</div>
                <div class="kpi-value" style="color:#198754">৳1.5L</div>
                <div class="detail-text">Sales from active campaigns</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Cost Per Lead (Orange)</div>
                <div class="kpi-value" style="color:#f39c12">৳320</div>
                <div class="detail-text">Marketing efficiency</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">Active Campaigns (Red)</div>
                <div class="kpi-value" style="color:#dc3545">5</div>
                <div class="detail-text">Running across platforms</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; background:linear-gradient(135deg, var(--card-bg) 0%, rgba(25, 135, 84, 0.05) 100%);">
                <h3 class="card-title">💰 Campaign ROI (Return on Investment)</h3>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div class="detail-text" style="margin-bottom:5px;">Total Ad Spend</div>
                        <b style="font-size:22px; color:#dc3545;">৳ 20,000</b>
                    </div>
                    <div style="font-size:24px; color:var(--border-soft);">➔</div>
                    <div style="text-align:right;">
                        <div class="detail-text" style="margin-bottom:5px;">Revenue Generated</div>
                        <b style="font-size:22px; color:#198754;">৳ 150,000</b>
                    </div>
                </div>
                <div style="margin-top:20px; padding:15px; background:var(--bg-light); border-radius:8px; text-align:center; border: 1px solid #198754;">
                    <span style="font-weight:600; font-size:14px; color:var(--text-main);">Current ROI: </span>
                    <span style="font-size:28px; font-weight:900; color:#198754;">7.5x</span>
                </div>
            </div>

            <div class="card" style="margin-bottom:0; display:flex; align-items:center; justify-content:space-between;">
                <div style="flex:1;">
                    <h3 class="card-title" style="border:none; margin-bottom:10px;">📊 Lead Sources</h3>
                    <div style="font-size:13px; color:var(--text-main); line-height:1.8;">
                        <div><span style="color:#0d6efd; font-size:18px;">●</span> Facebook (65%)</div>
                        <div><span style="color:#198754; font-size:18px;">●</span> WhatsApp (20%)</div>
                        <div><span style="color:#f39c12; font-size:18px;">●</span> Google Ads (10%)</div>
                        <div><span style="color:#6c757d; font-size:18px;">●</span> Organic (5%)</div>
                    </div>
                </div>
                <div style="flex:1; display:flex; justify-content:center;">
                    <div class="donut-chart">
                        <div class="donut-inner">
                            <b style="font-size:20px; color:var(--text-main);">125</b>
                            <span style="font-size:10px; color:var(--text-muted);">Total Leads</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">🎭 Creative Performance Insights</h3>
                <div style="margin-bottom:15px; border-bottom:1px dashed var(--border-soft); padding-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:bold; color:var(--text-main); font-size:14px;">Creative A (Video)</span><br>
                            <span style="font-size:11px; color:var(--text-muted);">CTR: <b>2.8%</b> | CPC: <b>৳15</b> | Conv: <b>8%</b></span>
                        </div>
                        <span style="color:#198754; font-weight:bold; font-size:15px;">50 Leads</span>
                    </div>
                </div>
                <div style="margin-bottom:15px; border-bottom:1px dashed var(--border-soft); padding-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:bold; color:var(--text-main); font-size:14px;">Creative B (Carousel)</span><br>
                            <span style="font-size:11px; color:var(--text-muted);">CTR: <b>1.5%</b> | CPC: <b>৳22</b> | Conv: <b>4%</b></span>
                        </div>
                        <span style="color:#0d6efd; font-weight:bold; font-size:15px;">30 Leads</span>
                    </div>
                </div>
                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:bold; color:var(--text-main); font-size:14px;">Creative C (Single Image)</span><br>
                            <span style="font-size:11px; color:#dc3545;">CTR: <b>0.8%</b> | CPC: <b>৳45</b> (Low)</span>
                        </div>
                        <span style="color:#f39c12; font-weight:bold; font-size:15px;">12 Leads</span>
                    </div>
                </div>

                <h4 style="font-size:11px; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Overall Lead Quality</h4>
                <div style="display:flex; height:10px; border-radius:5px; overflow:hidden; margin-bottom:8px;">
                    <div style="width:40%; background:#198754;" title="High: 40%"></div>
                    <div style="width:35%; background:#f1c40f;" title="Medium: 35%"></div>
                    <div style="width:25%; background:#dc3545;" title="Low: 25%"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-main); font-weight:bold;">
                    <span><span style="color:#198754;">■</span> High (40%)</span>
                    <span><span style="color:#f1c40f;">■</span> Medium (35%)</span>
                    <span><span style="color:#dc3545;">■</span> Low (25%)</span>
                </div>
            </div>

            <div class="card auto-refresh" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                <h3 class="card-title">🔄 Lead Distribution Monitor <span class="live-dot"></span></h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-blue">
                        <span class="detail-text" style="font-size:10px;">Just Now</span><br>
                        <b style="font-size:13px; color:var(--text-main);">Lead: Rahim (FB Ads)</b><br>
                        <span style="font-size:11px; color:#198754; font-weight:bold;">➔ Auto Assigned: Mutakkin</span>
                    </div>
                    <div class="timeline-item tl-green">
                        <span class="detail-text" style="font-size:10px;">15 mins ago</span><br>
                        <b style="font-size:13px; color:var(--text-main);">Lead: Karim (Website)</b><br>
                        <span style="font-size:11px; color:#198754; font-weight:bold;">➔ Auto Assigned: Rakib</span>
                    </div>
                    <div class="timeline-item tl-yellow">
                        <span class="detail-text" style="font-size:10px;">1 hour ago</span><br>
                        <b style="font-size:13px; color:var(--text-main);">Lead: Jamil (Google Ads)</b><br>
                        <span style="font-size:11px; color:#f1c40f; font-weight:bold;">➔ Manual Assigned: Hasan</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; overflow-x:auto;">
                <h3 class="card-title">📈 Live Campaign Status</h3>
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <th style="padding-bottom:10px;">Campaign</th>
                            <th style="padding-bottom:10px;">Spend</th>
                            <th style="padding-bottom:10px;">Leads</th>
                            <th style="padding-bottom:10px;">CPL</th>
                            <th style="padding-bottom:10px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">FB Tangua Haor</td>
                            <td style="padding:12px 0;">৳20,000</td>
                            <td style="padding:12px 0;">80</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">৳250</td>
                            <td style="padding:12px 0;"><span class="badge k-green">Active</span></td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Dubai Visa Ads</td>
                            <td style="padding:12px 0;">৳15,000</td>
                            <td style="padding:12px 0;">50</td>
                            <td style="padding:12px 0; color:#f1c40f; font-weight:bold;">৳300</td>
                            <td style="padding:12px 0;"><span class="badge k-green">Active</span></td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Google Purbachal</td>
                            <td style="padding:12px 0;">৳10,000</td>
                            <td style="padding:12px 0;">20</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">৳500</td>
                            <td style="padding:12px 0;"><span class="badge k-red">Paused</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📝 Campaign Planner (Notion Style)</h3>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="padding:12px; border:1px solid var(--border-soft); border-radius:6px; display:flex; justify-content:space-between; cursor:pointer; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary-bg)'" onmouseout="this.style.borderColor='var(--border-soft)'">
                        <span style="font-size:13px; font-weight:bold; color:var(--text-main);">📅 Content Calendar (March)</span>
                        <span style="font-size:12px; color:var(--text-muted);">Updated 2h ago</span>
                    </div>
                    <div style="padding:12px; border:1px solid var(--border-soft); border-radius:6px; display:flex; justify-content:space-between; cursor:pointer; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary-bg)'" onmouseout="this.style.borderColor='var(--border-soft)'">
                        <span style="font-size:13px; font-weight:bold; color:var(--text-main);">💡 Creative Brief (Purbachal)</span>
                        <span style="font-size:12px; color:var(--text-muted);">Draft</span>
                    </div>
                    <div style="padding:12px; border:1px solid var(--border-soft); border-radius:6px; display:flex; justify-content:space-between; cursor:pointer; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary-bg)'" onmouseout="this.style.borderColor='var(--border-soft)'">
                        <span style="font-size:13px; font-weight:bold; color:var(--text-main);">✍️ Video Script (Cox Hotel)</span>
                        <span style="font-size:12px; color:#198754; font-weight:bold;">Approved</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid">
            <div class="card" style="margin-bottom:0; overflow-x:auto; border-top: 4px solid #f39c12;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">🎨 Creative Task Board (Designer Workspace)</h3>
                    <button class="btn btn-blue btn-sm">+ Add Task</button>
                </div>
                
                <div style="display:flex; gap:15px; min-width:600px;">
                    <div style="flex:1; background:var(--bg-light); padding:10px; border-radius:8px; border:1px solid var(--border-soft);">
                        <b style="font-size:12px; color:var(--text-muted); text-transform:uppercase;">To Do (2)</b>
                        <div style="background:#fff; padding:10px; margin-top:10px; border-radius:5px; border-left:3px solid #dc3545; box-shadow:0 2px 4px rgba(0,0,0,0.05); cursor:pointer;">
                            <div style="font-size:13px; font-weight:bold; color:var(--text-main);">FB Ad Banner (Cox)</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:5px;">Due: Today</div>
                        </div>
                        <div style="background:#fff; padding:10px; margin-top:10px; border-radius:5px; border-left:3px solid #f1c40f; box-shadow:0 2px 4px rgba(0,0,0,0.05); cursor:pointer;">
                            <div style="font-size:13px; font-weight:bold; color:var(--text-main);">Reel Editing (Purbachal)</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:5px;">Due: Tomorrow</div>
                        </div>
                    </div>
                    
                    <div style="flex:1; background:var(--bg-light); padding:10px; border-radius:8px; border:1px solid var(--border-soft);">
                        <b style="font-size:12px; color:var(--text-muted); text-transform:uppercase;">In Progress (1)</b>
                        <div style="background:#fff; padding:10px; margin-top:10px; border-radius:5px; border-left:3px solid #0d6efd; box-shadow:0 2px 4px rgba(0,0,0,0.05); cursor:pointer;">
                            <div style="font-size:13px; font-weight:bold; color:var(--text-main);">Website Hero Image</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:5px;">Working...</div>
                        </div>
                    </div>
                    
                    <div style="flex:1; background:var(--bg-light); padding:10px; border-radius:8px; border:1px solid var(--border-soft);">
                        <b style="font-size:12px; color:var(--text-muted); text-transform:uppercase;">Approved (1)</b>
                        <div style="background:#fff; padding:10px; margin-top:10px; border-radius:5px; border-left:3px solid #198754; box-shadow:0 2px 4px rgba(0,0,0,0.05); cursor:pointer;">
                            <div style="font-size:13px; font-weight:bold; color:var(--text-main);">Visa Campaign Post</div>
                            <div style="font-size:11px; color:#198754; font-weight:bold; margin-top:5px;">Ready to publish</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📁 Brand Asset Center</h3>
                    <button class="btn btn-green btn-sm">↑ Upload Asset</button>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="padding:15px; border:1px solid var(--border-soft); border-radius:6px; text-align:center; cursor:pointer; background:#f8f9fa;">
                        <div style="font-size:24px; margin-bottom:5px;">🎨</div>
                        <b style="font-size:13px; color:var(--text-main);">Logo Pack (PNG/SVG)</b>
                    </div>
                    <div style="padding:15px; border:1px solid var(--border-soft); border-radius:6px; text-align:center; cursor:pointer; background:#f8f9fa;">
                        <div style="font-size:24px; margin-bottom:5px;">📐</div>
                        <b style="font-size:13px; color:var(--text-main);">Brand Guidelines</b>
                    </div>
                    <div style="padding:15px; border:1px solid var(--border-soft); border-radius:6px; text-align:center; cursor:pointer; background:#f8f9fa;">
                        <div style="font-size:24px; margin-bottom:5px;">🎬</div>
                        <b style="font-size:13px; color:var(--text-main);">Raw Video Footage</b>
                    </div>
                    <div style="padding:15px; border:1px solid var(--border-soft); border-radius:6px; text-align:center; cursor:pointer; background:#f8f9fa;">
                        <div style="font-size:24px; margin-bottom:5px;">📝</div>
                        <b style="font-size:13px; color:var(--text-main);">Ad Copy Docs</b>
                    </div>
                </div>

                <div style="background:rgba(220, 53, 69, 0.05); border-left:3px solid #dc3545; padding:10px; border-radius:4px;">
                    <b style="font-size:12px; color:#dc3545; text-transform:uppercase;">🚨 Urgent Request from Sales</b>
                    <div style="font-size:13px; color:var(--text-main); margin-top:4px;">"Need a fast FB Story for today's property fair at Cox's Bazar."</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Requested by: Mutakkin (10 mins ago)</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ----------------------------------------------------
// 💵 ACCOUNTS & FINANCE DASHBOARD (The Money Center - Polished)
// ----------------------------------------------------
function loadAccountsTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
                <h2 class="page-title" style="margin:0;">🏦 Financial Control Center</h2>
                <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-green btn-sm">+ Add Payment</button>
                <button class="btn btn-blue btn-sm">📄 Generate Receipt</button>
                <button class="btn btn-gold btn-sm">📊 Export Ledger</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">Today Collections</div>
                <div class="kpi-value" style="color:#0d6efd">৳ 2.50L</div>
                <div class="detail-text">Total cash & bank deposits today</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Total Collected (Month)</div>
                <div class="kpi-value" style="color:#198754">৳ 18.00L</div>
                <div class="detail-text">March 2026 Collection</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">Outstanding Due</div>
                <div class="kpi-value" style="color:#dc3545">৳ 42.50L</div>
                <div class="detail-text">Total pending from clients</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Installments Pending</div>
                <div class="kpi-value" style="color:#f39c12">28</div>
                <div class="detail-text">Expected this week</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                <h3 class="card-title">🚨 Overdue Installments (Critical)</h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                    
                    <div style="padding:15px; background:rgba(220, 53, 69, 0.05); border-left:4px solid #dc3545; border-radius:6px; margin-bottom:12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:15px; color:var(--text-main); text-decoration:underline; cursor:pointer;" onclick="open360Profile('Shafiq Islam', '01800000000', 'Cox Hotel', 'Overdue', '50,000', '2,00,000', 'Rakib')">Shafiq Islam (Cox Hotel)</b>
                            <span class="badge k-red" style="font-size:12px;">12 Days Overdue</span>
                        </div>
                        <div style="font-size:16px; font-weight:bold; color:#dc3545; margin-top:8px;">৳ 2,00,000</div>
                        <div style="margin-top:10px; display:flex; gap:8px;">
                            <button class="btn btn-red btn-sm" style="flex:1; font-size:12px;">Notify Sales Agent</button>
                            <button class="btn btn-gray btn-sm" style="flex:1; font-size:12px;">Send SMS Warning</button>
                        </div>
                    </div>
                    
                    <div style="padding:15px; background:rgba(253, 126, 20, 0.05); border-left:4px solid #fd7e14; border-radius:6px; margin-bottom:12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:15px; color:var(--text-main); text-decoration:underline; cursor:pointer;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Overdue', '1,00,000', '1,50,000', 'Hasan')">Rahim Uddin (Plot A12)</b>
                            <span class="badge k-orange" style="background:#fd7e14; color:#fff; font-size:12px;">5 Days Overdue</span>
                        </div>
                        <div style="font-size:16px; font-weight:bold; color:#fd7e14; margin-top:8px;">৳ 1,50,000</div>
                        <div style="margin-top:10px; display:flex; gap:8px;">
                            <button class="btn btn-orange btn-sm" style="flex:1; font-size:12px; background:#fd7e14; color:#fff; border:none; border-radius:4px;">Notify Sales Agent</button>
                            <button class="btn btn-gray btn-sm" style="flex:1; font-size:12px;">Send SMS</button>
                        </div>
                    </div>
                    
                    <div style="padding:15px; background:rgba(241, 196, 15, 0.05); border-left:4px solid #f1c40f; border-radius:6px; margin-bottom:12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:15px; color:var(--text-main); text-decoration:underline; cursor:pointer;" onclick="open360Profile('Jamil Hossain', '01900000000', 'Commercial', 'Overdue', '5,00,000', '50,000', 'Mutakkin')">Jamil Hossain (Commercial)</b>
                            <span class="badge k-yellow" style="font-size:12px;">2 Days Overdue</span>
                        </div>
                        <div style="font-size:16px; font-weight:bold; color:#f39c12; margin-top:8px;">৳ 50,000</div>
                        <div style="margin-top:10px; display:flex; gap:8px;">
                            <button class="btn btn-gold btn-sm" style="flex:1; font-size:12px;">Call Client</button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #f39c12;">
                <h3 class="card-title">📅 Upcoming Installments</h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                    <div style="border-left: 2px solid #f39c12; padding-left: 15px; margin-bottom: 20px;">
                        <span class="detail-text" style="font-size:12px; font-weight:bold;">Due: 10 March</span><br>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                            <div>
                                <b class="clickable-row" style="font-size:15px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Abdul Kuddus', '01722000000', 'Plot A12', 'Active', '1,00,000', '1,50,000', 'Hasan')">Abdul Kuddus</b> <span style="color:var(--text-muted); font-size:12px;">(Plot A12)</span><br>
                                <span style="font-size:14px; font-weight:bold; color:#198754;">৳ 1,50,000</span>
                            </div>
                            <div style="display:flex; gap:10px;">
                                <a href="https://wa.me/01722000000" target="_blank" style="text-decoration:none; font-size:20px;" title="Send WhatsApp Reminder">💬</a>
                                <a href="sms:01722000000" style="text-decoration:none; font-size:20px;" title="Send SMS Reminder">✉️</a>
                            </div>
                        </div>
                    </div>
                    
                    <div style="border-left: 2px solid #f39c12; padding-left: 15px; margin-bottom: 20px;">
                        <span class="detail-text" style="font-size:12px; font-weight:bold;">Due: 12 March</span><br>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                            <div>
                                <b class="clickable-row" style="font-size:15px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Karim Islam', '01811000000', 'Flat B4', 'Active', '5,00,000', '2,00,000', 'Rakib')">Karim Islam</b> <span style="color:var(--text-muted); font-size:12px;">(Flat B4)</span><br>
                                <span style="font-size:14px; font-weight:bold; color:#198754;">৳ 2,00,000</span>
                            </div>
                            <div style="display:flex; gap:10px;">
                                <a href="https://wa.me/01811000000" target="_blank" style="text-decoration:none; font-size:20px;" title="Send WhatsApp Reminder">💬</a>
                                <a href="sms:01811000000" style="text-decoration:none; font-size:20px;" title="Send SMS Reminder">✉️</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card auto-refresh" style="margin-bottom:0;">
                <h3 class="card-title">💸 Recent Collections <span class="live-dot"></span></h3>
                <div style="height: 220px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-blue">
                        <span class="detail-text" style="font-size:11px;">10 mins ago</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Rahim Uddin paid <span style="color:#198754;">৳ 50,000</span></b><br>
                        <span style="font-size:12px; color:var(--text-muted);">via Bank Transfer (City Bank)</span><br>
                        <span class="badge k-gray" style="margin-top:5px;">Receipt #1024</span>
                    </div>
                    <div class="timeline-item tl-green">
                        <span class="detail-text" style="font-size:11px;">1 hour ago</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Karim Islam paid <span style="color:#198754;">৳ 1,00,000</span></b><br>
                        <span style="font-size:12px; color:var(--text-muted);">via Cash</span><br>
                        <span class="badge k-gray" style="margin-top:5px;">Receipt #1025</span>
                    </div>
                    <div class="timeline-item tl-yellow">
                        <span class="detail-text" style="font-size:11px;">3 hours ago</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Jamil Hossain paid <span style="color:#198754;">৳ 20,000</span></b><br>
                        <span style="font-size:12px; color:var(--text-muted);">via Mobile Banking (Bkash)</span><br>
                        <span class="badge k-gray" style="margin-top:5px;">Receipt #1026</span>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0; overflow-x:auto;">
                <h3 class="card-title">📝 Booking Payment Status</h3>
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <th style="padding-bottom:10px;">Client</th>
                            <th style="padding-bottom:10px;">Project</th>
                            <th style="padding-bottom:10px; color:#198754;">Paid</th>
                            <th style="padding-bottom:10px; color:#dc3545;">Due</th>
                            <th style="padding-bottom:10px; text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td class="clickable-row" style="padding:12px 0; font-weight:bold; color:#0d6efd; text-decoration:underline;" onclick="open360Profile('Rahim', '01700000000', 'Plot A12', 'Active', '1,50,000', '50,000', 'Hasan')">Rahim</td>
                            <td style="padding:12px 0;">Plot A12</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">1,50,000</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">50,000</td>
                            <td style="padding:12px 0; text-align:right; display:flex; justify-content:flex-end; gap:5px;">
                                <button class="btn btn-blue btn-sm" style="font-size:11px; padding:4px 8px;">Ledger</button>
                                <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">+ Pay</button>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td class="clickable-row" style="padding:12px 0; font-weight:bold; color:#0d6efd; text-decoration:underline;" onclick="open360Profile('Karim', '01800000000', 'Plot B4', 'Active', '2,00,000', '0', 'Rakib')">Karim</td>
                            <td style="padding:12px 0;">Plot B4</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">2,00,000</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">0</td>
                            <td style="padding:12px 0; text-align:right; display:flex; justify-content:flex-end; gap:5px;">
                                <button class="btn btn-blue btn-sm" style="font-size:11px; padding:4px 8px;">Ledger</button>
                                <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">+ Pay</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="clickable-row" style="padding:12px 0; font-weight:bold; color:#0d6efd; text-decoration:underline;" onclick="open360Profile('Nusrat', '01900000000', 'Commercial', 'Active', '5,00,000', '10,00,000', 'Mutakkin')">Nusrat</td>
                            <td style="padding:12px 0;">Commercial</td>
                            <td style="padding:12px 0; color:#198754; font-weight:bold;">5,00,000</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">10,00,000</td>
                            <td style="padding:12px 0; text-align:right; display:flex; justify-content:flex-end; gap:5px;">
                                <button class="btn btn-blue btn-sm" style="font-size:11px; padding:4px 8px;">Ledger</button>
                                <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">+ Pay</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="main-grid">
            <div class="card" style="margin-bottom:0; overflow-x:auto; border-top: 4px solid #0d6efd;">
                <h3 class="card-title">✅ Commission Verification</h3>
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <th style="padding-bottom:10px;">Agent</th>
                            <th style="padding-bottom:10px;">Booking</th>
                            <th style="padding-bottom:10px;">Commission</th>
                            <th style="padding-bottom:10px; text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold;">Mutakkin</td>
                            <td style="padding:12px 0;">Plot A12</td>
                            <td style="padding:12px 0; color:#f39c12; font-weight:bold;">৳ 15,000</td>
                            <td style="padding:12px 0; text-align:right;">
                                <button class="btn btn-green btn-sm" style="padding:4px 8px; font-size:11px;">Approve</button>
                                <button class="btn btn-red btn-sm" style="padding:4px 8px; font-size:11px;">Reject</button>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0; font-weight:bold;">Rakib</td>
                            <td style="padding:12px 0;">Plot B4</td>
                            <td style="padding:12px 0; color:#f39c12; font-weight:bold;">৳ 12,000</td>
                            <td style="padding:12px 0; text-align:right;">
                                <button class="btn btn-green btn-sm" style="padding:4px 8px; font-size:11px;">Approve</button>
                                <button class="btn btn-red btn-sm" style="padding:4px 8px; font-size:11px;">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card" style="margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:15px;">
                    <div style="flex:1; min-width:120px;">
                        <h3 class="card-title" style="margin-bottom:15px; border:none; padding:0;">📈 Monthly Cash Flow</h3>
                        <div style="display:flex; align-items:flex-end; gap:10px; height:80px; border-bottom:2px solid var(--border-soft); margin-bottom:15px;">
                            <div style="flex:1; background:var(--border-soft); height:40%; border-radius:4px 4px 0 0; position:relative;" title="Jan: 10L">
                                <span style="position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--text-muted);">JAN</span>
                            </div>
                            <div style="flex:1; background:var(--btn-color); height:60%; border-radius:4px 4px 0 0; position:relative;" title="Feb: 14L">
                                <span style="position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--text-muted);">FEB</span>
                            </div>
                            <div style="flex:1; background:var(--primary-bg); height:85%; border-radius:4px 4px 0 0; position:relative;" title="Mar: 18L">
                                <span style="position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); font-size:10px; font-weight:bold; color:var(--text-main);">MAR</span>
                            </div>
                        </div>
                    </div>
                    <div style="flex:1; min-width:120px; border-left:1px solid var(--border-soft); padding-left:15px;">
                        <h3 class="card-title" style="margin-bottom:10px; border:none; padding:0;">💳 Payment Method</h3>
                        <div class="donut-chart" style="width:100px; height:100px; margin-bottom:10px;">
                            <div class="donut-inner" style="width:60px; height:60px;"></div>
                        </div>
                        <div style="font-size:11px; color:var(--text-main); line-height:1.6;">
                            <div><span style="color:#0d6efd;">●</span> Bank: <b>60%</b></div>
                            <div><span style="color:#198754;">●</span> Cash: <b>25%</b></div>
                            <div><span style="color:#f39c12;">●</span> MFS: <b>15%</b></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ----------------------------------------------------
// 🎯 NEW: CR EXECUTIVE DASHBOARD (The Recovery Engine)
// ----------------------------------------------------
function loadCRTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
                <h2 class="page-title" style="margin:0;">🎯 Client Recovery & Relations</h2>
                <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-green btn-sm">+ Log Payment</button>
                <button class="btn btn-blue btn-sm">📅 Schedule Follow-up</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">Today's Follow-ups</div>
                <div class="kpi-value" style="color:#0d6efd">12</div>
                <div class="detail-text">Clients to contact today</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">High Risk Clients</div>
                <div class="kpi-value" style="color:#dc3545">4</div>
                <div class="detail-text">Overdue by more than 15 days</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Total Overdue</div>
                <div class="kpi-value" style="color:#f39c12">৳ 12.50L</div>
                <div class="detail-text">Amount pending recovery</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Recovered This Week</div>
                <div class="kpi-value" style="color:#198754">৳ 3.50L</div>
                <div class="detail-text">Successfully collected amount</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📞 Today's Follow-up Tasks</h3>
                    <span class="badge k-blue" style="background:#0d6efd; color:#fff;">12 Pending</span>
                </div>
                <div style="height: 220px; overflow-y: auto; padding-right: 5px;">
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Hasan Ali', '01711000000', 'Plot A12', 'Follow-up', '1,00,000', '50,000', 'Rakib')">Hasan Ali</b>
                            <span style="font-size:11px; color:#dc3545; font-weight:bold;">Due: 11:00 AM</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Call for overdue payment (৳ 50,000)</div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">✔ Done</button>
                            <button class="btn btn-gold btn-sm" style="flex:1; font-size:11px; padding:4px;">Reschedule</button>
                        </div>
                    </div>
                    
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Nusrat Jahan', '01811000000', 'Commercial Space', 'Follow-up', '5,00,000', '0', 'Mutakkin')">Nusrat Jahan</b>
                            <span style="font-size:11px; color:#f39c12; font-weight:bold;">Due: 03:00 PM</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Regular installment reminder</div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">✔ Done</button>
                            <button class="btn btn-gold btn-sm" style="flex:1; font-size:11px; padding:4px;">Reschedule</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                <h3 class="card-title">🚨 High Risk / Overdue Clients</h3>
                <div style="height: 220px; overflow-y: auto; padding-right: 10px;">
                    <div style="padding:12px; background:rgba(220, 53, 69, 0.05); border-left:3px solid #dc3545; border-radius:4px; margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Shafiq Islam', '01800000000', 'Cox Hotel', 'Overdue', '50,000', '2,00,000', 'Rakib')">Shafiq Islam</b>
                            <span class="badge k-red" style="font-size:11px;">25 Days Overdue</span>
                        </div>
                        <div style="font-size:13px; font-weight:bold; color:#dc3545; margin-top:4px;">Amount: ৳ 2,00,000</div>
                        <div style="margin-top:8px; display:flex; gap:10px;">
                            <a href="tel:01800000000" style="text-decoration:none; font-size:18px;" title="Call">📱</a>
                            <a href="https://wa.me/01800000000" target="_blank" style="text-decoration:none; font-size:18px;" title="WhatsApp">💬</a>
                            <a href="sms:01800000000" style="text-decoration:none; font-size:18px;" title="SMS">✉️</a>
                        </div>
                    </div>
                    
                    <div style="padding:12px; background:rgba(253, 126, 20, 0.05); border-left:3px solid #fd7e14; border-radius:4px; margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Overdue', '1,00,000', '1,50,000', 'Hasan')">Rahim Uddin</b>
                            <span class="badge k-orange" style="background:#fd7e14; color:#fff; font-size:11px;">12 Days Overdue</span>
                        </div>
                        <div style="font-size:13px; font-weight:bold; color:#fd7e14; margin-top:4px;">Amount: ৳ 1,50,000</div>
                        <div style="margin-top:8px; display:flex; gap:10px;">
                            <a href="tel:01700000000" style="text-decoration:none; font-size:18px;" title="Call">📱</a>
                            <a href="https://wa.me/01700000000" target="_blank" style="text-decoration:none; font-size:18px;" title="WhatsApp">💬</a>
                            <a href="sms:01700000000" style="text-decoration:none; font-size:18px;" title="SMS">✉️</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📝 Recent Client Interactions</h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-blue">
                        <span class="detail-text" style="font-size:10px;">Today, 10:30 AM</span><br>
                        <b style="font-size:13px; color:var(--text-main);">Spoke with Rahim Uddin</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">"Client requested 5 days extension due to personal reasons. Approved temporarily."</span>
                    </div>
                    <div class="timeline-item tl-green">
                        <span class="detail-text" style="font-size:10px;">Yesterday, 04:15 PM</span><br>
                        <b style="font-size:13px; color:var(--text-main);">WhatsApp sent to Karim</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">"Sent payment link and receipt of last transaction."</span>
                    </div>
                    <div class="timeline-item tl-red">
                        <span class="detail-text" style="font-size:10px;">2 Days Ago</span><br>
                        <b style="font-size:13px; color:var(--text-main);">Failed to reach Shafiq</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">"Phone switched off. Notified Sales Agent Rakib to visit site."</span>
                    </div>
                </div>
            </div>
            
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📈 My Recovery Performance</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; margin-top:20px;">
                    <div>
                        <div class="detail-text" style="font-weight:bold; margin-bottom:5px;">Target Recovery (Month)</div>
                        <b style="font-size:22px; color:var(--text-muted);">৳ 20,00,000</b>
                    </div>
                    <div style="text-align:right;">
                        <div class="detail-text" style="font-weight:bold; color:#198754; margin-bottom:5px;">Recovered So Far</div>
                        <b style="font-size:28px; color:#198754;">৳ 13,00,000</b>
                    </div>
                </div>
                <div class="bar-wrap" style="height:12px; background:rgba(25,135,84,0.2);">
                    <div class="bar-fill" style="width:65%; background:#198754;"></div>
                </div>
                <div class="detail-text" style="text-align:right; margin-top:5px; font-weight:bold;">Recovery Rate: 65%</div>
            </div>
        </div>
    </div>
    `;
}

// ----------------------------------------------------
// 🏃 NEW: OFFICE ASSISTANT DASHBOARD (Logistics Hub)
// ----------------------------------------------------
function loadOfficeAssistantTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
                <h2 class="page-title" style="margin:0;">🏃 Logistics & Task Control</h2>
                <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn btn-green btn-sm">+ Update Task</button>
                <button class="btn btn-blue btn-sm">📦 Deliver Item</button>
                <button class="btn btn-gold btn-sm">🚚 Send Courier</button>
                <button class="btn btn-gray btn-sm">⚡ Complete Errand</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">Today's Tasks</div>
                <div class="kpi-value" style="color:#0d6efd">6</div>
                <div class="detail-text">Pending daily duties</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Pending Requisitions</div>
                <div class="kpi-value" style="color:#f39c12">4</div>
                <div class="detail-text">Items to purchase/collect</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Courier Tasks</div>
                <div class="kpi-value" style="color:#198754">2</div>
                <div class="detail-text">To send or receive</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">Office Supplies Low</div>
                <div class="kpi-value" style="color:#dc3545">3</div>
                <div class="detail-text">Needs restock immediately</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📋 Daily Task List</h3>
                    <span class="badge k-blue" style="background:#0d6efd; color:#fff;">6 Pending</span>
                </div>
                <div style="height: 220px; overflow-y: auto; padding-right: 5px;">
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="font-size:14px; color:var(--text-main);">Deliver agreement to client</b>
                            <span class="badge k-red">High Priority</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Location: Gulshan 1, Client: Rahim</div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">✔ Done</button>
                            <button class="btn btn-blue btn-sm" style="flex:1; font-size:11px; padding:4px;">▶ Start</button>
                            <button class="btn btn-gray btn-sm" style="flex:1; font-size:11px; padding:4px;">⏸ Delay</button>
                        </div>
                    </div>
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="font-size:14px; color:var(--text-main);">Bank Deposit (City Bank)</b>
                            <span class="badge k-yellow">Medium</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Deposit ৳50,000 cash to main branch</div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">✔ Done</button>
                            <button class="btn btn-blue btn-sm" style="flex:1; font-size:11px; padding:4px;">▶ Start</button>
                            <button class="btn btn-gray btn-sm" style="flex:1; font-size:11px; padding:4px;">⏸ Delay</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #f39c12;">
                <h3 class="card-title">🛒 Office Requisition Tasks</h3>
                <div style="height: 220px; overflow-y: auto; padding-right: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div>
                            <b style="font-size:13px; color:var(--text-main);">Printer Paper (A4)</b><br>
                            <span style="font-size:11px; color:var(--text-muted);">Req by: Sales Dept</span>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-gold btn-sm" style="font-size:11px; padding:4px 8px;">Purchase</button>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div>
                            <b style="font-size:13px; color:var(--text-main);">Office Tea & Sugar</b><br>
                            <span style="font-size:11px; color:var(--text-muted);">Req by: Admin</span>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">Delivered</button>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div>
                            <b style="font-size:13px; color:var(--text-main);">Stationery & Pens</b><br>
                            <span style="font-size:11px; color:var(--text-muted);">Req by: Accounts</span>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <span class="badge k-gray">Pending</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">🚚 Courier & Document Tracking</h3>
                <div style="height: 150px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-blue">
                        <b style="font-size:13px; color:var(--text-main);">Courier sent to Chittagong</b><br>
                        <span class="detail-text" style="font-size:11px;">Sundarban Courier - Tracking #8847</span>
                    </div>
                    <div class="timeline-item tl-green">
                        <b style="font-size:13px; color:var(--text-main);">Document received from Rajshahi</b><br>
                        <span class="detail-text" style="font-size:11px;">Handed over to Accounts dept.</span>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📦 Office Supplies Monitor</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(220, 53, 69, 0.05); border-radius:6px; border-left:3px solid #dc3545; margin-bottom:8px;">
                    <b style="font-size:13px; color:var(--text-main);">Printer Paper</b>
                    <span class="badge k-red">Low</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(241, 196, 15, 0.05); border-radius:6px; border-left:3px solid #f1c40f; margin-bottom:8px;">
                    <b style="font-size:13px; color:var(--text-main);">Stationery</b>
                    <span class="badge k-yellow">Low</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(25, 135, 84, 0.05); border-radius:6px; border-left:3px solid #198754;">
                    <b style="font-size:13px; color:var(--text-main);">Tea & Coffee</b>
                    <span class="badge k-green">OK</span>
                </div>
            </div>
        </div>

        <div class="main-grid">
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">👥 Visitor Assistance</h3>
                <div style="border-left: 2px solid #0d6efd; padding-left: 15px; margin-bottom: 15px;">
                    <span class="detail-text" style="font-size:11px; font-weight:bold;">11:30 AM (Expected)</span><br>
                    <b style="font-size:14px; color:var(--text-main);">Client: Rahim Uddin</b><br>
                    <span style="font-size:12px; color:var(--text-muted);">Action: Receive client & Serve Tea</span>
                </div>
                <div style="border-left: 2px solid #198754; padding-left: 15px;">
                    <span class="detail-text" style="font-size:11px; font-weight:bold;">02:00 PM</span><br>
                    <b style="font-size:14px; color:var(--text-main);">Meeting Room Prep</b><br>
                    <span style="font-size:12px; color:var(--text-muted);">Sales Team Meeting</span>
                </div>
            </div>
            
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">⚡ Recent Activities & Errands</h3>
                <div style="height: 150px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-green">
                        <b style="font-size:13px; color:var(--text-main);">Bank deposit completed</b><br>
                        <span class="detail-text" style="font-size:10px;">City Bank - 10:00 AM</span>
                    </div>
                    <div class="timeline-item tl-blue">
                        <b style="font-size:13px; color:var(--text-main);">Document delivered</b><br>
                        <span class="detail-text" style="font-size:10px;">To Client Hasan - Yesterday</span>
                    </div>
                    <div class="timeline-item tl-yellow">
                        <b style="font-size:13px; color:var(--text-main);">Utility bill payment</b><br>
                        <span class="detail-text" style="font-size:10px;">Electricity bill cleared - Yesterday</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================================================
// 🛎️ NEW: FRONT DESK / RECEPTION DASHBOARD (The Reception Hub)
// ============================================================================
function loadFrontDeskTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
                <h2 class="page-title" style="margin:0;">🛎️ Front Desk Control Center</h2>
                <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn btn-green btn-sm" onclick="switchTab('crm')">➕ Add New Lead</button>
                <button class="btn btn-blue btn-sm">📝 Register Visitor</button>
                <button class="btn btn-gold btn-sm">📅 Schedule Visit</button>
                <button class="btn btn-gray btn-sm">📞 Log Incoming Call</button>
                <button class="btn btn-orange btn-sm" style="background:#fd7e14; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-size:12px;">+ Create Follow-up</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">New Leads Today</div>
                <div class="kpi-value" style="color:#0d6efd">8</div>
                <div class="detail-text">Captured at front desk</div>
            </div>
            
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Visitors Today</div>
                <div class="kpi-value" style="color:#198754">5</div>
                <div class="detail-text">Walk-ins & scheduled</div>
            </div>
            
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Calls Received</div>
                <div class="kpi-value" style="color:#f39c12">12</div>
                <div class="detail-text">Inbound inquiries</div>
            </div>
            
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">Visits Scheduled</div>
                <div class="kpi-value" style="color:#dc3545">4</div>
                <div class="detail-text">For today & tomorrow</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            
            <div class="card" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📅 Upcoming Visits</h3>
                    <span class="badge k-blue" style="background:#0d6efd; color:#fff;">2 Scheduled</span>
                </div>
                <div style="height: 180px; overflow-y: auto; padding-right: 5px;">
                    
                    <div class="clickable-row" style="border-left: 3px solid #0d6efd; padding-left: 15px; margin-bottom: 15px; background:rgba(13,110,253,0.05); padding:10px; border-radius:4px;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Site Visit', '0', '0', 'Hasan')">
                        <span class="detail-text" style="font-size:11px; font-weight:bold; color:#0d6efd;">Tomorrow, 10:30 AM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Rahim Uddin</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">Purpose: Plot Visit | Agent: Hasan</span>
                    </div>
                    
                    <div class="clickable-row" style="border-left: 3px solid #198754; padding-left: 15px; background:rgba(25,135,84,0.05); padding:10px; border-radius:4px;" onclick="open360Profile('Karim Islam', '01800000000', 'Flat B4', 'Meeting', '0', '0', 'Rakib')">
                        <span class="detail-text" style="font-size:11px; font-weight:bold; color:#198754;">Friday, 04:00 PM</span><br>
                        <b style="font-size:14px; color:var(--text-main);">Client: Karim Islam</b><br>
                        <span style="font-size:12px; color:var(--text-muted);">Purpose: Office Meeting | Agent: Rakib</span>
                    </div>
                    
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #f39c12;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📞 Today's Follow-ups</h3>
                    <span class="badge k-yellow" style="font-size:12px;">3 Pending</span>
                </div>
                <div style="height: 180px; overflow-y: auto; padding-right: 5px;">
                    
                    <div style="padding:10px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:var(--text-main);">Rahim</b>
                            <span style="font-size:11px; color:#f39c12; font-weight:bold;">Call Reminder</span>
                        </div>
                        <div style="margin-top:5px; display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="font-size:10px; padding:3px 6px;">✔ Done</button>
                            <a href="tel:01700000000" class="btn btn-blue btn-sm" style="font-size:10px; padding:3px 6px; text-decoration:none;">Call Now</a>
                        </div>
                    </div>
                    
                    <div style="padding:10px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:var(--text-main);">Karim</b>
                            <span style="font-size:11px; color:#f39c12; font-weight:bold;">Visit Confirmation</span>
                        </div>
                        <div style="margin-top:5px; display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="font-size:10px; padding:3px 6px;">✔ Done</button>
                            <a href="https://wa.me/01800000000" target="_blank" class="btn btn-gold btn-sm" style="font-size:10px; padding:3px 6px; text-decoration:none;">WhatsApp</a>
                        </div>
                    </div>

                    <div style="padding:10px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:var(--text-main);">Nusrat</b>
                            <span style="font-size:11px; color:#dc3545; font-weight:bold;">Payment Reminder</span>
                        </div>
                        <div style="margin-top:5px; display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="font-size:10px; padding:3px 6px;">✔ Done</button>
                            <a href="tel:01900000000" class="btn btn-blue btn-sm" style="font-size:10px; padding:3px 6px; text-decoration:none;">Call Now</a>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            
            <div class="card" style="margin-bottom:0; border-top: 4px solid #198754;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📋 Today's Visitor Log</h3>
                    <span class="badge k-green">3 Visitors</span>
                </div>
                <div style="height: 250px; overflow-y: auto; padding-right: 5px;">
                    
                    <div style="padding:12px; background:rgba(25, 135, 84, 0.05); border-left:3px solid #198754; border-radius:4px; margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Rahim Uddin', '01700000000', 'Plot A12', 'Meeting', '0', '0', 'Sales Team')">Rahim Uddin</b>
                            <span style="font-size:11px; font-weight:bold; color:var(--text-muted);">10:30 AM</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Purpose: Sales Meeting | Status: <span style="color:#198754; font-weight:bold;">In Office</span></div>
                        <div style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                            <button class="btn btn-blue btn-sm" style="flex:1; font-size:11px; padding:4px;">🖨️ Print Pass</button>
                            <button class="btn btn-gold btn-sm" style="flex:1; font-size:11px; padding:4px;">🔔 Notify Agent</button>
                            <button class="btn btn-gray btn-sm" style="flex:1; font-size:11px; padding:4px;">Check-out</button>
                        </div>
                    </div>
                    
                    <div style="padding:12px; background:rgba(241, 196, 15, 0.05); border-left:3px solid #f1c40f; border-radius:4px; margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Karim Islam', '01800000000', 'Flat B4', 'Inquiry', '0', '0', 'Front Desk')">Karim Islam</b>
                            <span style="font-size:11px; font-weight:bold; color:var(--text-muted);">12:00 PM</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Purpose: Project Inquiry | Status: <span style="color:#f39c12; font-weight:bold;">Waiting</span></div>
                        <div style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                            <button class="btn btn-blue btn-sm" style="flex:1; font-size:11px; padding:4px;">🖨️ Print Pass</button>
                            <button class="btn btn-gold btn-sm" style="flex:1; font-size:11px; padding:4px;">Assign Room</button>
                        </div>
                    </div>

                    <div style="padding:12px; background:rgba(13, 110, 253, 0.05); border-left:3px solid #0d6efd; border-radius:4px; margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Nusrat', '01900000000', 'Commercial', 'Payment', '5,00,000', '0', 'Accounts')">Nusrat</b>
                            <span style="font-size:11px; font-weight:bold; color:var(--text-muted);">03:00 PM</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Purpose: Payment | Status: <span style="color:#0d6efd; font-weight:bold;">Expected</span></div>
                        <div style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                            <button class="btn btn-green btn-sm" style="flex:1; font-size:11px; padding:4px;">Check-in</button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                <h3 class="card-title">📞 Incoming Call Log</h3>
                <div style="height: 250px; overflow-y: auto; padding-right: 10px;">
                    
                    <div style="padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:var(--text-main);">01711-XXXXXX (New)</b>
                            <span style="font-size:11px; color:var(--text-muted);">Just Now</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Inquiry: General Info</div>
                        <div style="margin-top:8px; display:flex; gap:5px;">
                            <button class="btn btn-green btn-sm" style="font-size:10px; padding:4px 8px;">+ Create Lead</button>
                            <button class="btn btn-blue btn-sm" style="font-size:10px; padding:4px 8px;">Forward to Sales</button>
                        </div>
                    </div>
                    
                    <div style="padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b class="clickable-row" style="font-size:13px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Rahim', '01700000000', 'Plot A12', 'Contacted', '0', '0', 'Front Desk')">Rahim (Existing)</b>
                            <span style="font-size:11px; color:var(--text-muted);">1 hour ago</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Inquiry: Project details</div>
                        <div style="margin-top:8px; display:flex; gap:5px;">
                            <button class="btn btn-gold btn-sm" style="font-size:10px; padding:4px 8px;">Schedule Visit</button>
                        </div>
                    </div>

                    <div style="padding:12px; border-bottom:1px solid var(--border-soft);">
                        <div style="display:flex; justify-content:space-between;">
                            <b class="clickable-row" style="font-size:13px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('Karim', '01800000000', 'Plot B4', 'Active', '0', '0', 'Accounts')">Karim (Existing)</b>
                            <span style="font-size:11px; color:var(--text-muted);">2 hours ago</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Question regarding payment method.</div>
                        <div style="margin-top:8px; display:flex; gap:5px;">
                            <button class="btn btn-gray btn-sm" style="font-size:10px; padding:4px 8px; background:#6c757d; color:#fff;">Forward to Accounts</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <div class="main-grid">
            
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📊 Lead Pipeline Summary</h3>
                <div style="display:flex; gap:10px; text-align:center; overflow-x:auto; padding-bottom:10px;">
                    <div style="flex:1; min-width:80px; background:rgba(13, 110, 253, 0.1); border:1px solid #0d6efd; padding:15px; border-radius:6px;">
                        <b style="font-size:24px; color:#0d6efd;">12</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">New Leads</span>
                    </div>
                    <div style="flex:1; min-width:80px; background:rgba(23, 162, 184, 0.1); border:1px solid #17a2b8; padding:15px; border-radius:6px;">
                        <b style="font-size:24px; color:#17a2b8;">8</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Contacted</span>
                    </div>
                    <div style="flex:1; min-width:80px; background:rgba(241, 196, 15, 0.1); border:1px solid #f1c40f; padding:15px; border-radius:6px;">
                        <b style="font-size:24px; color:#f39c12;">5</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Visits Set</span>
                    </div>
                    <div style="flex:1; min-width:80px; background:rgba(25, 135, 84, 0.1); border:1px solid #198754; padding:15px; border-radius:6px;">
                        <b style="font-size:24px; color:#198754;">2</b><br><span style="font-size:12px; font-weight:bold; color:var(--text-main);">Deals Won</span>
                    </div>
                </div>
            </div>
            
            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">⚡ Recent Activities</h3>
                <div style="height: 150px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-green">
                        <b style="font-size:13px; color:var(--text-main);">Visitor Registered</b><br>
                        <span class="detail-text" style="font-size:10px;">Rahim Uddin (Check-in: 10:30 AM)</span>
                    </div>
                    <div class="timeline-item tl-blue">
                        <b style="font-size:13px; color:var(--text-main);">Call Forwarded</b><br>
                        <span class="detail-text" style="font-size:10px;">Forwarded lead call to Sales Agent Rakib</span>
                    </div>
                    <div class="timeline-item tl-yellow">
                        <b style="font-size:13px; color:var(--text-main);">New Lead Added</b><br>
                        <span class="detail-text" style="font-size:10px;">Entered walk-in lead details (1 hour ago)</span>
                    </div>
                    <div class="timeline-item tl-red">
                        <b style="font-size:13px; color:var(--text-main);">Visit Scheduled</b><br>
                        <span class="detail-text" style="font-size:10px;">Scheduled Karim for tomorrow 3 PM</span>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>
    `;
}

// ============================================================================
// 🏢 NEW: ADMIN & HR LOGISTIC (Company Control Center)
// ============================================================================
function loadAdminControlCenterTab() {
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
    <div style="animation: fadeIn 0.5s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
                <h2 class="page-title" style="margin:0;">🏢 Company Control Center</h2>
                <p class="detail-text" style="margin:0;">Role: <b>${CURRENT_USER.role}</b> | Dept: <b>${CURRENT_USER.department}</b></p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn btn-green btn-sm" onclick="switchTab('hr')">✅ Approve Leave</button>
                <button class="btn btn-blue btn-sm">📋 Add Task</button>
                <button class="btn btn-gold btn-sm">📅 Book Room</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #0d6efd;">
                <div class="kpi-label" style="color:#0d6efd;">Employees Present</div>
                <div class="kpi-value" style="color:#0d6efd">42 <span style="font-size:16px; color:var(--text-muted);">/ 45</span></div>
                <div class="detail-text">Today's Attendance</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #f39c12;">
                <div class="kpi-label" style="color:#f39c12;">Pending Requisitions</div>
                <div class="kpi-value" style="color:#f39c12">7</div>
                <div class="detail-text">Awaiting Admin Approval</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #dc3545;">
                <div class="kpi-label" style="color:#dc3545;">Open Incidents</div>
                <div class="kpi-value" style="color:#dc3545">2</div>
                <div class="detail-text">Maintenance & IT Issues</div>
            </div>
            <div class="card" style="margin-bottom:0; border-bottom: 4px solid #198754;">
                <div class="kpi-label" style="color:#198754;">Expected Visitors</div>
                <div class="kpi-value" style="color:#198754">5</div>
                <div class="detail-text">Scheduled for today</div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">🗺️ Employee Attendance Heatmap</h3>
                    <button class="btn btn-gray btn-sm">View All</button>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                    <div style="padding:10px; background:rgba(25, 135, 84, 0.05); border-left:3px solid #198754; flex:1; border-radius:4px;">
                        <b style="font-size:14px; color:var(--text-main);">Present (42)</b>
                        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">On-time: 38 | Late: 4</div>
                    </div>
                    <div style="padding:10px; background:rgba(220, 53, 69, 0.05); border-left:3px solid #dc3545; flex:1; border-radius:4px;">
                        <b style="font-size:14px; color:var(--text-main);">Absent (3)</b>
                        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">On Leave: 2 | Uninformed: 1</div>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(10, 1fr); gap:4px; margin-top:15px;">
                    ${Array(42).fill('<div style="height:15px; background:#198754; border-radius:2px;" title="Present"></div>').join('')}
                    ${Array(3).fill('<div style="height:15px; background:#dc3545; border-radius:2px;" title="Absent"></div>').join('')}
                </div>
            </div>
            
            <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                <h3 class="card-title">🚨 Live HR & Admin Alerts</h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 5px;">
                    <div style="padding:10px; border-radius:6px; margin-bottom:8px; background:rgba(220, 53, 69, 0.05); border-left:3px solid #dc3545;">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:#dc3545;">Low Office Supplies</b>
                            <span style="font-size:11px; color:var(--text-muted);">10 mins ago</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-main); margin-top:4px;">Printer paper and stationery running low.</div>
                    </div>
                    <div style="padding:10px; border-radius:6px; margin-bottom:8px; background:rgba(241, 196, 15, 0.05); border-left:3px solid #f1c40f;">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:#f39c12;">Leave Request Pending</b>
                            <span style="font-size:11px; color:var(--text-muted);">1 hr ago</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-main); margin-top:4px;">Hasan (Sales) requested 2 days casual leave.</div>
                        <div style="margin-top:5px;"><button class="btn btn-gold btn-sm" style="font-size:10px; padding:2px 5px;">Review</button></div>
                    </div>
                    <div style="padding:10px; border-radius:6px; margin-bottom:8px; background:rgba(13, 110, 253, 0.05); border-left:3px solid #0d6efd;">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:13px; color:#0d6efd;">Visitor Waiting</b>
                            <span style="font-size:11px; color:var(--text-muted);">Just Now</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-main); margin-top:4px;">Client at reception for Mutakkin.</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; overflow-x:auto;">
                <h3 class="card-title">🛒 Office Requisition Management</h3>
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <th style="padding-bottom:10px;">Item Requested</th>
                            <th style="padding-bottom:10px;">Department</th>
                            <th style="padding-bottom:10px;">Amount</th>
                            <th style="padding-bottom:10px; text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Printer Paper</td>
                            <td style="padding:12px 0;">Marketing</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">৳ 2,500</td>
                            <td style="padding:12px 0; text-align:right; display:flex; gap:5px; justify-content:flex-end;">
                                <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">Approve</button>
                                <button class="btn btn-red btn-sm" style="font-size:11px; padding:4px 8px;">Reject</button>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Office Chair</td>
                            <td style="padding:12px 0;">Sales</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">৳ 8,000</td>
                            <td style="padding:12px 0; text-align:right; display:flex; gap:5px; justify-content:flex-end;">
                                <button class="btn btn-blue btn-sm" style="font-size:11px; padding:4px 8px;">Send to Purchase</button>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0; font-weight:bold; color:var(--text-main);">Tea Supplies</td>
                            <td style="padding:12px 0;">Office</td>
                            <td style="padding:12px 0; color:#dc3545; font-weight:bold;">৳ 1,500</td>
                            <td style="padding:12px 0; text-align:right; display:flex; gap:5px; justify-content:flex-end;">
                                <button class="btn btn-green btn-sm" style="font-size:11px; padding:4px 8px;">Approve</button>
                                <button class="btn btn-red btn-sm" style="font-size:11px; padding:4px 8px;">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card" style="margin-bottom:0; background:linear-gradient(135deg, var(--card-bg) 0%, rgba(220, 53, 69, 0.03) 100%);">
                <h3 class="card-title">📉 Office Expense Tracker</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <div>
                        <div class="detail-text" style="font-weight:bold; margin-bottom:5px;">Budget limit (Monthly)</div>
                        <b style="font-size:22px; color:var(--text-muted);">৳ 50,000</b>
                    </div>
                    <div style="text-align:right;">
                        <div class="detail-text" style="font-weight:bold; color:#dc3545; margin-bottom:5px;">Spent So Far</div>
                        <b style="font-size:28px; color:#dc3545;">৳ 32,500</b>
                    </div>
                </div>
                <div class="bar-wrap" style="height:12px; background:rgba(220,53,69,0.2);">
                    <div class="bar-fill" style="width:65%; background:#dc3545;"></div>
                </div>
                <div class="detail-text" style="text-align:right; margin-top:5px; font-weight:bold;">65% Budget Utilized</div>
                
                <div style="margin-top:20px; font-size:12px; color:var(--text-main); line-height:1.8;">
                    <div style="display:flex; justify-content:space-between;"><span>Office Supplies:</span> <b>৳ 12,000</b></div>
                    <div style="display:flex; justify-content:space-between;"><span>Maintenance Cost:</span> <b>৳ 15,500</b></div>
                    <div style="display:flex; justify-content:space-between;"><span>Utilities:</span> <b>৳ 5,000</b></div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0; border-top: 4px solid #0d6efd;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">📋 Employee Task Board</h3>
                    <button class="btn btn-blue btn-sm">Assign Task</button>
                </div>
                <div style="height: 180px; overflow-y: auto; padding-right: 5px;">
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="font-size:14px; color:var(--text-main);">Courier Delivery (Bank)</b>
                            <span class="badge k-yellow">In Progress</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">Assigned to: <b>Office Assistant (Riyaz)</b></div>
                    </div>
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="font-size:14px; color:var(--text-main);">Prepare Meeting Room 1</b>
                            <span class="badge k-gray">Pending</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">Assigned to: <b>Front Desk (Laboni)</b></div>
                    </div>
                    <div style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; margin-bottom:10px; background:#f8f9fa;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="font-size:14px; color:var(--text-main);">Collect Documents</b>
                            <span class="badge k-green">Completed</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">Assigned to: <b>Logistics Team</b></div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0; border-top: 4px solid #dc3545;">
                <h3 class="card-title">⚠️ Incident / Issue Monitor</h3>
                <div style="height: 180px; overflow-y: auto; padding-right: 10px;">
                    <div class="timeline-item tl-green">
                        <b style="font-size:13px; color:var(--text-main);">Internet Down</b><br>
                        <span class="detail-text" style="font-size:11px;">Resolved at 10:45 AM</span>
                    </div>
                    <div class="timeline-item tl-red">
                        <b style="font-size:13px; color:var(--text-main);">Printer Problem (Accounts)</b><br>
                        <span class="detail-text" style="font-size:11px; color:#dc3545; font-weight:bold;">Pending Technician</span>
                    </div>
                    <div class="timeline-item tl-yellow">
                        <b style="font-size:13px; color:var(--text-main);">AC Repair (Meeting Room 2)</b><br>
                        <span class="detail-text" style="font-size:11px;">Scheduled for 4:00 PM</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-grid" style="margin-bottom: 24px;">
            <div class="card" style="margin-bottom:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 class="card-title" style="margin:0; border:none;">🚪 Meeting Room Manager</h3>
                    <span class="badge k-blue">2 Rooms</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div style="padding:12px; border:1px solid #dc3545; border-radius:6px; background:rgba(220, 53, 69, 0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b style="font-size:14px; color:var(--text-main);">Meeting Room 1</b>
                            <span class="badge k-red">Booked (11 AM - 1 PM)</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Booked by: Sales Team (Client Visit)</div>
                    </div>
                    <div style="padding:12px; border:1px solid #198754; border-radius:6px; background:rgba(25, 135, 84, 0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <b style="font-size:14px; color:var(--text-main);">Meeting Room 2</b>
                            <span class="badge k-green">Available</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Ready for booking</div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:0;">
                <h3 class="card-title">📦 Office Resource Monitoring</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(220, 53, 69, 0.05); border-radius:6px; border-left:3px solid #dc3545; margin-bottom:10px;">
                    <b style="font-size:14px; color:var(--text-main);">Printer Paper</b>
                    <span class="badge k-red">Low (Order Now)</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(25, 135, 84, 0.05); border-radius:6px; border-left:3px solid #198754; margin-bottom:10px;">
                    <b style="font-size:14px; color:var(--text-main);">Office Tea & Sugar</b>
                    <span class="badge k-green">OK</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(241, 196, 15, 0.05); border-radius:6px; border-left:3px solid #f1c40f;">
                    <b style="font-size:14px; color:var(--text-main);">Stationery (Pens, Files)</b>
                    <span class="badge k-yellow">Low</span>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom:0; border-top: 4px solid #17a2b8;">
            <h3 class="card-title">🌐 Inter-Departmental Productivity Score</h3>
            <div style="display:flex; gap:15px; text-align:center; overflow-x:auto; padding-bottom:10px;">
                <div style="flex:1; min-width:120px; background:var(--bg-light); border:1px solid var(--border-soft); padding:15px; border-radius:8px;">
                    <span style="font-size:24px;">📢</span><br>
                    <b style="font-size:14px; color:var(--text-main); margin-top:5px; display:block;">Marketing</b>
                    <span style="font-size:12px; color:#198754; font-weight:bold;">5 Campaigns Active</span>
                </div>
                <div style="flex:1; min-width:120px; background:var(--bg-light); border:1px solid var(--border-soft); padding:15px; border-radius:8px;">
                    <span style="font-size:24px;">💼</span><br>
                    <b style="font-size:14px; color:var(--text-main); margin-top:5px; display:block;">Sales</b>
                    <span style="font-size:12px; color:#0d6efd; font-weight:bold;">20 Active Leads</span>
                </div>
                <div style="flex:1; min-width:120px; background:var(--bg-light); border:1px solid var(--border-soft); padding:15px; border-radius:8px;">
                    <span style="font-size:24px;">🏦</span><br>
                    <b style="font-size:14px; color:var(--text-main); margin-top:5px; display:block;">Accounts</b>
                    <span style="font-size:12px; color:#f39c12; font-weight:bold;">3 Payments Pending</span>
                </div>
                <div style="flex:1; min-width:120px; background:var(--bg-light); border:1px solid var(--border-soft); padding:15px; border-radius:8px;">
                    <span style="font-size:24px;">🎯</span><br>
                    <b style="font-size:14px; color:var(--text-main); margin-top:5px; display:block;">CR & Recovery</b>
                    <span style="font-size:12px; color:#dc3545; font-weight:bold;">5 Overdue Clients</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ----------------------------------------------------
// 📄 REPORTS MODULE FRONTEND (Advanced PDF & Filters)
// ----------------------------------------------------
async function loadReportsTab() {
    const appDiv = document.getElementById('app');
    
    // 🔒 STRICT RBAC LOGIC: Who can see all agents?
    let isTopLevel = (CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect');
    
    let agentSelectHTML = '';
    if (isTopLevel) {
        agentSelectHTML = `
            <div style="flex:1; min-width:150px;">
                <label class="detail-text" style="display:block; margin-bottom:5px;">Staff / Agent</label>
                <select id="repAgent" style="width:100%; padding:10px; border-radius:5px; border:1px solid var(--border-soft);">
                    <option value="All Agents">🌐 All Agents</option>
                    <option value="${CURRENT_USER.name}">👤 My Report Only</option>
                    </select>
            </div>
        `;
    } else {
        agentSelectHTML = `
            <div style="flex:1; min-width:150px;">
                <label class="detail-text" style="display:block; margin-bottom:5px;">Staff / Agent</label>
                <select id="repAgent" style="width:100%; padding:10px; border-radius:5px; border:1px solid var(--border-soft); background:#e9ecef; cursor:not-allowed;" disabled>
                    <option value="${CURRENT_USER.name}">👤 ${CURRENT_USER.name} (Locked)</option>
                </select>
            </div>
        `;
    }

    appDiv.innerHTML = `
    <div class="card" style="text-align:center; padding: 40px; animation: fadeIn 0.4s;">
        <h2 class="page-title">Advanced Reporting Hub</h2>
        <p class="detail-text">Generate, view, and download system reports based on your access level.</p>
        
        <div style="display:flex; gap:15px; justify-content:center; align-items:flex-end; margin-top:25px; flex-wrap:wrap; text-align:left; max-width:850px; margin-left:auto; margin-right:auto; background:var(--bg-light); padding:20px; border-radius:8px; border:1px solid var(--border-soft);">
            
            <div style="flex:1; min-width:150px;">
                <label class="detail-text" style="display:block; margin-bottom:5px;">Time Period</label>
                <select id="repTime" style="width:100%; padding:10px; border-radius:5px; border:1px solid var(--border-soft);">
                    <option value="Last 24 Hours">Last 24 Hours</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="All Time">All Time</option>
                </select>
            </div>

            <div style="flex:1; min-width:150px;">
                <label class="detail-text" style="display:block; margin-bottom:5px;">Project Filter</label>
                <select id="repProject" style="width:100%; padding:10px; border-radius:5px; border:1px solid var(--border-soft);">
                    <option value="All Projects">🏢 All Projects</option>
                    <option value="Cox Holiday Inn">🏨 Cox Holiday Inn</option>
                    <option value="Purbachal Divine City">🏠 Purbachal Divine City</option>
                    <option value="Divine Elite Residence">🏢 Divine Elite Residence</option>
                </select>
            </div>

            ${agentSelectHTML}

            <div style="flex:1; min-width:150px;">
                <button class="btn btn-blue" style="width:100%; padding:11px;" onclick="generateReport()">📊 Generate Report</button>
            </div>
        </div>

        <div id="reportActionArea" style="display:none; text-align:right; margin-top:20px; max-width:850px; margin-left:auto; margin-right:auto;">
            <button class="btn btn-red" style="font-size:14px; padding:10px 20px;" onclick="downloadReportPDF()">📥 Download as PDF</button>
        </div>

        <div id="reportArea" style="margin-top:15px; text-align:left; max-width:850px; margin-left:auto; margin-right:auto; padding:30px; background:var(--card-bg); border:1px solid var(--border-soft); border-radius:8px; min-height:200px; display:none; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        </div>
    </div>`;
}

async function generateReport() {
    document.getElementById('reportArea').style.display = "block";
    document.getElementById('reportActionArea').style.display = "none";
    document.getElementById('reportArea').innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight:bold;">⚙️ Processing Data... Please wait.</div>`;
    
    let timeRange = document.getElementById('repTime').value;
    let project = document.getElementById('repProject').value;
    let agent = document.getElementById('repAgent').value;
    
    // API Call - Sending all filters to backend
    const res = await apiCall('generateReportHTML', { agent: agent, time: timeRange, project: project });
    
    if(res) {
        document.getElementById('reportArea').innerHTML = res;
        document.getElementById('reportActionArea').style.display = "block"; // Show PDF Button
    } else {
        document.getElementById('reportArea').innerHTML = `<div style="text-align:center; color:#dc3545; padding:30px; font-weight:bold;">❌ No data found for the selected filters.</div>`;
    }
}

// 🖨️ High-Quality PDF Downloader
function downloadReportPDF() {
    let printContent = document.getElementById('reportArea').innerHTML;
    let timeFilter = document.getElementById('repTime').value;
    let projectFilter = document.getElementById('repProject').value;
    let agentFilter = document.getElementById('repAgent').value;

    let printWindow = window.open('', '_blank', 'width=1000,height=800'); 
    printWindow.document.write(`
        <html>
        <head>
            <title>Divine OS - Official Report</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; background: #fff; }
                .report-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0f4c3a; padding-bottom: 15px; margin-bottom: 25px; }
                .report-header img { max-height: 50px; }
                .report-title { text-align: right; }
                .report-title h2 { margin: 0; color: #0f4c3a; text-transform: uppercase; font-size: 22px; }
                .report-title p { margin: 5px 0 0 0; font-size: 12px; color: #666; }
                
                .meta-box { background: #f8f9fa; border: 1px solid #eee; padding: 15px; border-radius: 5px; display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 30px; }
                .meta-item { display: flex; flex-direction: column; }
                .meta-label { font-weight: bold; color: #666; font-size: 11px; text-transform: uppercase; margin-bottom: 3px; }
                .meta-value { color: #111; font-weight: bold; font-size: 14px; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #0f4c3a; color: #fff; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
                tr:nth-child(even) { background-color: #fcfcfc; }
                
                .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
            </style>
        </head>
        <body>
            <div class="report-header">
                <div>
                    <img src="https://divinegroupbd.net/images/divine-group-logo.png" alt="Divine Group">
                </div>
                <div class="report-title">
                    <h2>System Performance Report</h2>
                    <p>Generated by Divine OS ERP</p>
                </div>
            </div>
            
            <div class="meta-box">
                <div class="meta-item">
                    <span class="meta-label">Generated By</span>
                    <span class="meta-value">${CURRENT_USER.name} (${CURRENT_USER.role})</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Time Period</span>
                    <span class="meta-value">${timeFilter}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Project</span>
                    <span class="meta-value">${projectFilter}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Agent/Staff</span>
                    <span class="meta-value">${agentFilter}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Print Date</span>
                    <span class="meta-value">${new Date().toLocaleString()}</span>
                </div>
            </div>

            ${printContent}
            
            <div class="footer">
                &copy; ${new Date().getFullYear()} Divine Group of Companies Ltd. | Confidential System Generated Document
            </div>
            
            <script>
                window.onload = function() { 
                    setTimeout(() => { window.print(); }, 800); 
                }
            </script>
        </body>
        </html>
    `); 
    printWindow.document.close();
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
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap;">
        <h2 class="page-title" style="margin:0;">Bookings Management</h2>
        ${(CURRENT_USER.department === 'Sales Department' || CURRENT_USER.role === 'CEO' || CURRENT_USER.role === 'Chief System Architect') 
            ? `<button class="btn btn-green" onclick="openBookingModal()">+ Add New Booking</button>` 
            : ''}
    </div>
    
    <div class="card" style="padding:0; overflow-x:auto;">
        <table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;" class="desktop-table">
            <thead style="background:var(--bg-light); border-bottom:1px solid var(--border-soft);">
                <tr>
                    <th style="padding:15px;">Booking ID</th>
                    <th style="padding:15px;">Customer</th>
                    <th style="padding:15px;">Project</th>
                    <th style="padding:15px;">Total Price</th>
                    <th style="padding:15px;">Total Paid</th>
                    <th style="padding:15px;">Agent</th>
                    <th style="padding:15px;">Action</th>
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
            <tr style="border-bottom:1px solid var(--border-soft);">
                <td data-label="Booking ID" style="padding:15px;"><b>${b.id}</b><br><small class="detail-text">${b.leadId}</small></td>
                <td data-label="Customer" style="padding:15px; font-weight:600;">${b.name}</td>
                <td data-label="Project" style="padding:15px;">${b.project}</td>
                <td data-label="Total Price" style="padding:15px;">৳ ${b.price}</td>
                <td data-label="Total Paid" style="padding:15px; color:var(--btn-color); font-weight:bold;">৳ ${b.paid}</td>
                <td data-label="Agent" style="padding:15px;">${b.agent}</td>
                <td data-label="Action" style="padding:15px;">${actionBtn}</td>
            </tr>`;
        });
    } else { 
        html += `<tr><td colspan="7" style="text-align:center; padding:20px;">No bookings found.</td></tr>`; 
    }
    
    html += `</tbody></table></div>`;
    
    // Modals
    html += `
    <div id="bookingModal" class="erp-modal">
        <div class="card" style="margin:50px auto; max-width:500px; border-top: 4px solid var(--btn-color);">
            <h3 class="card-title">Create New Booking</h3>
            
            <label>Select Prospect</label>
            <select id="b_lead" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;" onchange="autoFillBooking()"><option value="">Loading leads...</option></select>
            
            <input type="hidden" id="b_name">
            <input type="hidden" id="b_project">
            
            <label>Lead Type</label>
            <select id="b_type" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
                <option value="SGL">SGL (Self Generated Lead) - 4%</option>
                <option value="MPL">MPL (Marketing Provided Lead) - 3%</option>
            </select>
            
            <label>Total Deal Price (Tk)</label>
            <input type="number" id="b_price" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <label>Booking / Down Payment Received (Tk)</label>
            <input type="number" id="b_paid" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:5px;">
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px;" onclick="submitBooking()">Submit Booking</button> 
            <button class="btn btn-gray" style="width:100%;" onclick="closeBookingModal()">Cancel</button>
        </div>
    </div>`;

    html += `
    <div id="payModal" class="erp-modal">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #f1c40f;">
            <h3 class="card-title">Update Payment</h3>
            <p id="payClientInfo" style="font-size:14px; font-weight:bold; margin-bottom:15px;"></p>
            
            <input type="hidden" id="p_bkgId">
            <input type="hidden" id="p_oldPaid">
            
            <label>New Amount Received (Tk)</label>
            <input type="number" id="p_newAmt" placeholder="e.g. 50000" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:5px;">
            
            <button class="btn btn-gold" style="width:100%; margin-bottom:10px;" onclick="submitPaymentUpdate()">Save Update</button> 
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
    
    if(!newAmt) {
        return alert("Enter amount.");
    }
    
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
                <b class="clickable-row" style="font-size:14px; color:var(--text-main); text-decoration:underline;" onclick="open360Profile('${l.name}', '${l.phone}', '${l.product}', '${l.status}', '0', '0', '${CURRENT_USER.name}')">${l.name}</b><br>
                <div class="wings-btn" onclick="toggleWings('${l.id}')">📞 ${l.phone}</div><br>
                <div class="detail-text" style="margin-bottom:8px;">📝 ${l.remarks || 'No remarks'}</div>
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge" style="background:#eee; color:#333;">📅 ${dateTxt}</span>
                    <button class="btn btn-blue btn-sm" style="padding:4px 8px; font-size:11px;" onclick="openKanbanModal('${l.id}', '${l.status}', '${l.nextDate}', '${l.remarks}', '${l.erp}')">Update</button>
                </div>

                <div id="wings_${l.id}" class="wings-panel">
                    <div id="his_${l.id}" class="history-list">Loading history...</div>
                    <div style="display:flex; gap:5px; margin-bottom:5px;">
                        <input type="text" id="cn_${l.id}" placeholder="Call Note" style="flex:1; padding:4px; font-size:11px; border:1px solid #ccc; border-radius:3px;">
                        <button class="btn btn-green btn-sm" style="padding:4px 8px; font-size:11px;" onclick="saveCallNote('${l.id}')">Add Note</button>
                    </div>
                    <button class="btn btn-gold btn-sm" style="width:100%; font-size:11px;" onclick="openMeetingModal('${l.id}', '${l.name}', '${l.product}')">📅 Schedule</button>
                </div>
            </div>`;
        }
    });

    let html = `<h2 class="page-title">Pipeline Management</h2><div class="kanban-board">`;
    for(let status in cols) { 
        html += `<div class="kanban-col"><h4 class="card-title">${status}</h4>${cols[status] || '<p style="text-align:center; color:var(--text-muted); font-size:12px;">Empty</p>'}</div>`; 
    }
    html += `</div>`;
    
    html += `
    <div id="modal" class="erp-modal">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #0d6efd;">
            <h3 class="card-title">Update Pipeline Stage</h3>
            <input type="hidden" id="lid">
            
            <label>Stage</label>
            <select id="st" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interested">Interested</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Booking">Booking (Deal Won)</option>
                <option value="Reject">Reject (Lost)</option>
            </select>
            
            <label>Next Follow-up Date</label>
            <input type="date" id="nxtDate" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <label>Remarks</label>
            <input type="text" id="rmk" placeholder="Why changing stage?" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <div id="erpBox">
                <label>ERP ID (Mandatory for Deal)</label>
                <input id="erp" placeholder="Enter ERP ID" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:5px;">
            </div>
            
            <button class="btn btn-green" style="width:100%; margin-bottom:10px;" onclick="saveLead()">Save Update</button> 
            <button class="btn btn-red" style="width:100%;" onclick="closeModal()">Cancel</button>
        </div>
    </div>`;

    html += `
    <div id="meetingModal" class="erp-modal">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #f1c40f;">
            <h3 class="card-title">Schedule Meeting / Site Visit</h3>
            <input type="hidden" id="m_lid">
            
            <label>Prospect</label>
            <input type="text" id="m_name" readonly style="background:#eee; width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <label>Project</label>
            <input type="text" id="m_prod" readonly style="background:#eee; width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <div style="flex:1">
                    <label>Date</label>
                    <input type="date" id="m_date" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:5px;">
                </div>
                <div style="flex:1">
                    <label>Time</label>
                    <input type="time" id="m_time" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:5px;">
                </div>
            </div>
            
            <button class="btn btn-gold" style="width:100%; margin-bottom:10px;" onclick="saveMeeting()">Confirm</button> 
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
    if(!note) {
        return;
    }
    
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
    
    if(!date || !time) {
        return alert("Select Date & Time");
    }
    
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
    
    if(p.stage === 'Contacted' && !p.erpId) {
        return alert("❌ ERP ID is Required!");
    }
    
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
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap;">
        <h2 class="page-title" style="margin:0;">Expense & Requisitions</h2>
        <button class="btn btn-red" onclick="openReqModal()">+ Create Requisition</button>
    </div>
    
    <div class="card" style="padding:0; overflow-x:auto;">
        <table style="width:100%; text-align:left; border-collapse:collapse; font-size:12px;">
            <thead style="background:var(--bg-light); border-bottom:1px solid var(--border-soft);">
                <tr>
                    <th style="padding:15px;">ID & Date</th>
                    <th style="padding:15px;">Requested By</th>
                    <th style="padding:15px;">Amount & Type</th>
                    <th style="padding:15px;">Purpose & Attach</th>
                    <th style="padding:15px;">TL Auth</th>
                    <th style="padding:15px;">Admin Auth</th>
                    <th style="padding:15px;">CEO Auth</th>
                    <th style="padding:15px;">Accounts</th>
                    <th style="padding:15px;">Final Status</th>
                </tr>
            </thead>
            <tbody>`;
            
    if(reqs.length > 0) {
        reqs.forEach(r => {
            // 🔒 Execute Privacy Filters
            if (isBasicUser && r.user !== CURRENT_USER.name) return; 
            if (isTL && r.dept !== r_dept && r.user !== CURRENT_USER.name) return; 
            if (isAccounts && r.ceoApp !== 'Approved' && r.user !== CURRENT_USER.name) return;

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
                btnHtml = `<button class="btn btn-green btn-sm" onclick="approveReq('${r.id}', 'Accounts')">Pay</button>`;
            }
            
            if((r.finalStatus.includes('Logistic 🟢') || r.finalStatus.includes('Printed ✅')) && (isAccounts || r.user === CURRENT_USER.name || isCEO || isAdmin)) {
                btnHtml += `<br><button class="btn btn-blue btn-sm" style="margin-top:5px;" onclick="printVoucher('${r.id}')">🖨️ View Voucher</button>`;
            }

            let attachLink = r.attachment ? `<a href="${r.attachment}" target="_blank" style="color:blue;">📎 View Bill</a>` : '<small style="color:gray;">No Attach</small>';

            html += `
            <tr style="border-bottom:1px solid var(--border-soft);">
                <td data-label="ID & Date" style="padding:15px;"><b>${r.id}</b><br><small class="detail-text">${r.date}</small></td>
                <td data-label="Requested By" style="padding:15px;"><b>${r.user}</b><br><small class="detail-text">${r.dept}</small></td>
                <td data-label="Amount" style="padding:15px; color:#dc3545;"><b>৳ ${r.amount}</b><br><small class="detail-text">${r.reqType}</small></td>
                <td data-label="Purpose" style="padding:15px;">${r.purpose}<br>${attachLink}</td>
                <td data-label="TL Auth" style="padding:15px;"><span class="badge ${r.tlApp==='Approved'?'k-green':r.tlApp==='Rejected'?'k-red':'k-yellow'}">${r.tlApp}</span></td>
                <td data-label="Admin Auth" style="padding:15px;"><span class="badge ${r.adminApp==='Approved'?'k-green':r.adminApp==='Rejected'?'k-red':'k-yellow'}">${r.adminApp}</span></td>
                <td data-label="CEO Auth" style="padding:15px;"><span class="badge ${r.ceoApp==='Approved'?'k-green':r.ceoApp==='Rejected'?'k-red':'k-yellow'}">${r.ceoApp}</span></td>
                <td data-label="Accounts" style="padding:15px;"><span class="badge ${r.accApp==='Approved'?'k-green':'k-yellow'}">${r.accApp}</span></td>
                <td data-label="Status" style="padding:15px;"><b>${r.finalStatus}</b><br>${btnHtml}</td>
            </tr>`;
        });
    } else { 
        html += `<tr><td colspan="9" style="text-align:center; padding:20px;">No requisitions found.</td></tr>`; 
    }
    
    html += `</tbody></table></div>`;

    html += `
    <div id="reqModal" class="erp-modal">
        <div class="card" style="margin:50px auto; max-width:400px; border-top: 4px solid #dc3545; max-height:80vh; overflow-y:auto;">
            <h3 class="card-title">Create Requisition</h3>
            
            <label>Requisition Type</label>
            <select id="rqType" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;"></select>
            
            <label>Amount Needed (Tk)</label>
            <input type="number" id="rqAmt" placeholder="e.g. 5000" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div style="flex:1">
                    <label>Expense Category</label>
                    <select id="rqCat" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:5px;">
                        <option>Travel & Transport</option>
                        <option>Office Supply</option>
                        <option>Marketing</option>
                        <option>Legal & Bank</option>
                    </select>
                </div>
                <div style="flex:1">
                    <label>Payment Mode</label>
                    <select id="rqMode" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:5px;">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Advance</option>
                    </select>
                </div>
            </div>
            
            <label>Purpose / Details</label>
            <input type="text" id="rqPur" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
            
            <label>Attachment URL</label>
            <input type="text" id="rqAtt" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:5px;">
            
            <button class="btn btn-red" style="width:100%; margin-bottom:10px;" onclick="submitReq()">Submit Requisition</button> 
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
    let req = CACHE.requisitions.find(r => r.id === reqId);
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
        if(rawData) {
            CACHE.dashboardAdmin = JSON.parse(rawData);
        }
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
        <h3 class="card-title">🚀 Manual Lead Assignment</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input id="cName" placeholder="Client Name" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px;">
          <input id="cPhone" placeholder="Phone" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px;">
          <select id="cProd" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px;">
            <option value="Cox Hotel">🏨 Cox Hotel</option>
            <option value="Purbachal Land">🏠 Purbachal Land</option>
            <option value="Commercial Space">🏢 Commercial Space</option>
          </select>
          <select id="cAgent" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px;">
            <option value="Round Robin">Round Robin</option>
          </select>
          <button class="btn btn-green" onclick="addLead()">Assign Lead</button>
        </div>
      </div>
      
      <div class="card">
        <h3 class="card-title">👮 Agent Status (Access Control)</h3>
        <div id="agents">Loading...</div>
      </div>
    `;
    appDiv.innerHTML = html;

    let cAgentOpts = '<option value="Round Robin">🔄 Round Robin</option>';
    let agHtml = '<table style="width:100%; text-align:left; border-collapse:collapse; font-size:13px;"><thead style="border-bottom:1px solid var(--border-soft);"><tr><th style="padding-bottom:10px;">Name</th><th style="padding-bottom:10px;">Department</th><th style="padding-bottom:10px;">Role</th><th style="padding-bottom:10px;">Status</th><th style="padding-bottom:10px;">Action</th></tr></thead><tbody>';
    
    data.team.forEach(a => {
        cAgentOpts += `<option value="${a.name}">${a.name}</option>`;
        let isChecked = (a.status === 'Active' || a.status === 'Visit') ? 'checked' : '';
        let statusText = (a.status === 'Visit' || a.status === 'Offline') ? '🚶 On Visit' : a.status;
        agHtml += `
        <tr style="border-bottom:1px solid var(--border-soft);">
            <td style="padding:10px 0;"><b>${a.name}</b></td>
            <td style="padding:10px 0;"><small>${a.dept}</small></td>
            <td style="padding:10px 0;"><small>${a.role}</small></td>
            <td style="padding:10px 0;"><b>${statusText}</b></td>
            <td style="padding:10px 0;">
                <label class="switch">
                    <input type="checkbox" ${isChecked} onchange="toggleAgent('${a.name}')">
                    <span class="slider"></span>
                </label>
            </td>
        </tr>`;
    });
    agHtml += '</tbody></table>';
    
    document.getElementById('agents').innerHTML = agHtml;
    document.getElementById('cAgent').innerHTML = cAgentOpts;
}

function renderAdminCRM(data) {
    if(!data) return;
    
    let stHtml = `
    <h2 class="page-title">Admin Control</h2>
    <div class="main-grid">
        <div class="card">
            <h3 class="card-title">Team Performance</h3>
            <table style="width:100%;text-align:left;border-collapse:collapse;font-size:13px;">
                <thead style="border-bottom:2px solid var(--border-soft);">
                    <tr>
                        <th style="padding-bottom:10px;">Agent</th>
                        <th style="padding-bottom:10px;">Total</th>
                        <th style="padding-bottom:10px;">Sold</th>
                    </tr>
                </thead>
                <tbody>`;
                
    for(let ag in data.stats) { 
        let s = data.stats[ag]; 
        stHtml += `
        <tr style="border-bottom:1px solid var(--border-soft);">
            <td style="padding:10px 0;font-weight:600;">${ag}</td>
            <td style="padding:10px 0;">${s.total}</td>
            <td style="padding:10px 0;color:var(--btn-color);font-weight:bold;">${s.sold}</td>
        </tr>`; 
    }
    
    stHtml += `
                </tbody>
            </table>
        </div>
    </div>`; 
    
    document.getElementById('app').innerHTML += stHtml; 
}

async function goVisit() {
    const res = await apiCall('toggleSalesmanStatus', { user: CURRENT_USER.name });
    
    if(res === 'Visit') { 
        document.getElementById('offBtn').innerText = "Return from Visit"; 
        document.getElementById('offBtn').className = "btn btn-green btn-sm"; 
        showToast("You are on VISIT."); 
    } else { 
        document.getElementById('offBtn').innerText = "🚶 Visit"; 
        document.getElementById('offBtn').className = "btn btn-gold btn-sm"; 
        showToast("You are ACTIVE."); 
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
    if(!p.phone) {
        return alert("Phone required!");
    }
    
    const res = await apiCall('adminManualEntry', { data: p }); 
    showToast(res); 
    clearCache(); 
    loadAdminTab();
}

async function reassign(id) {
    let agent = document.getElementById('re_'+id).value; 
    if(!agent) {
        return alert("Select an agent");
    }
    
    const res = await apiCall('adminReassignLead', { id: id, agent: agent }); 
    showToast("Reassigned Successfully!"); 
    clearCache(); 
    loadCRMTab();
}