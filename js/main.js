/* ============================================================
   CalcHub — Shared JavaScript  v4
   ============================================================ */

// ── CALCULATOR REGISTRY ──────────────────────────────────────
const CALCS = [
  // ── Finance ──
  { id:'mortgage',          name:'Mortgage Calculator',       icon:'🏠', cat:'Finance',   desc:'Monthly payment & total cost',          popular:true  },
  { id:'compound-interest', name:'Compound Interest',         icon:'📈', cat:'Finance',   desc:'Investment growth over time',            popular:true  },
  { id:'loan',              name:'Loan Calculator',           icon:'💳', cat:'Finance',   desc:'Auto, personal & student loans',         popular:true  },
  { id:'retirement',        name:'Retirement Calculator',     icon:'🏦', cat:'Finance',   desc:'Project your retirement savings',        popular:true  },
  { id:'roi',               name:'ROI Calculator',            icon:'💰', cat:'Finance',   desc:'Return on investment',                   popular:false },
  { id:'tax',               name:'Tax Calculator',            icon:'🧾', cat:'Finance',   desc:'2025 US federal income tax estimate',    popular:true  },
  { id:'savings',           name:'Savings Goal',              icon:'🐷', cat:'Finance',   desc:'Time to reach your savings goal',        popular:false },
  { id:'amortization',      name:'Amortization Calculator',   icon:'📋', cat:'Finance',   desc:'Full monthly payment schedule',          popular:false },
  { id:'auto-loan',         name:'Auto Loan Calculator',      icon:'🚗', cat:'Finance',   desc:'Car payment & total interest',           popular:true  },
  { id:'salary',            name:'Salary Calculator',         icon:'💵', cat:'Finance',   desc:'Hourly, weekly, monthly & annual pay',   popular:true  },
  { id:'inflation',         name:'Inflation Calculator',      icon:'📉', cat:'Finance',   desc:'Purchasing power over time',             popular:false },
  // ── Health ──
  { id:'bmi',               name:'BMI Calculator',            icon:'⚖️',  cat:'Health',    desc:'Body mass index & healthy range',        popular:true  },
  { id:'calorie',           name:'Calorie Calculator',        icon:'🍎', cat:'Health',    desc:'Daily calorie & macro needs',            popular:true  },
  { id:'body-fat',          name:'Body Fat Calculator',       icon:'📊', cat:'Health',    desc:'Body fat % via Navy method',             popular:false },
  { id:'pregnancy',         name:'Pregnancy Due Date',        icon:'🤱', cat:'Health',    desc:'Due date & pregnancy week tracker',      popular:false },
  { id:'bmr',               name:'BMR Calculator',            icon:'🔥', cat:'Health',    desc:'Calories burned at rest (basal rate)',   popular:false },
  { id:'ideal-weight',      name:'Ideal Weight',              icon:'🎯', cat:'Health',    desc:'Healthy weight range for your height',   popular:false },
  { id:'sleep',             name:'Sleep Calculator',          icon:'😴', cat:'Health',    desc:'Best bedtime & wake-up based on cycles', popular:true  },
  { id:'ovulation',         name:'Ovulation Calculator',      icon:'🌸', cat:'Health',    desc:'Fertile window & ovulation date',        popular:false },
  // ── Math ──
  { id:'standard',          name:'Standard Calculator',       icon:'🔢', cat:'Math',      desc:'Basic arithmetic',                       popular:false },
  { id:'scientific',        name:'Scientific Calculator',     icon:'🔬', cat:'Math',      desc:'Trig, log, exponents & more',            popular:false },
  { id:'percentage',        name:'Percentage Calculator',     icon:'%',  cat:'Math',      desc:'Percent of, change & ratio',             popular:true  },
  { id:'random-number',     name:'Random Number Generator',   icon:'🎲', cat:'Math',      desc:'Numbers, dice, coin flip & more',        popular:false },
  // ── Everyday ──
  { id:'tip',               name:'Tip Calculator',            icon:'🍽️', cat:'Everyday',  desc:'Bill splitting made easy',               popular:true  },
  { id:'unit-converter',    name:'Unit Converter',            icon:'💱', cat:'Everyday',  desc:'Length, weight, temp & volume',          popular:false },
  { id:'age',               name:'Age Calculator',            icon:'🎂', cat:'Everyday',  desc:'Exact age between two dates',            popular:false },
  { id:'gpa',               name:'GPA Calculator',            icon:'🎓', cat:'Everyday',  desc:'Grade point average calculator',         popular:false },
  { id:'discount',          name:'Discount Calculator',       icon:'🏷️', cat:'Everyday',  desc:'Sale price & savings amount',            popular:false },
  { id:'date-difference',   name:'Date Difference',           icon:'📅', cat:'Everyday',  desc:'Days, weeks & months between dates',     popular:false },
  { id:'grade',             name:'Grade Calculator',          icon:'📝', cat:'Everyday',  desc:'Weighted grade & letter grade',          popular:false },
  { id:'password-generator',name:'Password Generator',        icon:'🔐', cat:'Everyday',  desc:'Strong random passwords',                popular:false },
  { id:'word-counter',      name:'Word Counter',              icon:'📄', cat:'Everyday',  desc:'Words, chars, sentences & reading time', popular:false },
  { id:'time-zone',         name:'Time Zone Converter',       icon:'🌍', cat:'Everyday',  desc:'Convert time between any cities',        popular:false },
];

// ── PATH HELPER ──────────────────────────────────────────────
function calcPath(id) {
  const isRoot = !window.location.pathname.includes('/calculators/');
  return isRoot ? `calculators/${id}.html` : `${id}.html`;
}

// ── RECENTLY USED (localStorage) ─────────────────────────────
const RECENT_KEY = 'calchub_recent';
const RECENT_MAX = 5;

function trackCalcView(id) {
  try {
    let recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    recent = [id, ...recent.filter(x => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch(e) {}
}

function getRecentCalcs() {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return ids.map(id => CALCS.find(c => c.id === id)).filter(Boolean);
  } catch(e) { return []; }
}

function renderRecentStrip() {
  const strip = document.getElementById('recent-strip');
  const pills = document.getElementById('recent-pills');
  if (!strip || !pills) return;
  const recent = getRecentCalcs();
  if (!recent.length) return;
  pills.innerHTML = recent.map(c =>
    `<a class="recent-pill" href="${calcPath(c.id)}">${c.icon} ${c.name}</a>`
  ).join('');
  strip.style.display = 'flex';
}

// ── SEARCH ───────────────────────────────────────────────────
function initSearch(inputId, dropdownId) {
  const input    = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { dropdown.classList.remove('open'); return; }
    const matches = CALCS.filter(c =>
      c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!matches.length) { dropdown.classList.remove('open'); return; }
    dropdown.innerHTML = matches.map(c => `
      <a class="search-item${c.soon ? ' search-item-soon' : ''}" href="${c.soon ? '#' : calcPath(c.id)}" ${c.soon ? 'onclick="showToast();return false;"' : ''}>
        <span class="search-item-icon">${c.icon}</span>
        <span>${c.name}</span>
        ${c.soon ? '<span class="search-item-cat" style="color:var(--orange)">Soon</span>' : `<span class="search-item-cat">${c.cat}</span>`}
      </a>`).join('');
    dropdown.classList.add('open');
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

// ── KEYBOARD SHORTCUT (/ to focus search) ────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('header-search-input') || document.getElementById('hero-search');
      if (input) { input.focus(); input.select(); }
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

// ── VIEW TOGGLE (grid / list) ─────────────────────────────────
function initViewToggles() {
  document.querySelectorAll('[data-section]').forEach(section => {
    const sectionId = section.dataset.section;
    const grid = document.getElementById(sectionId + '-grid');
    if (!grid) return;
    section.querySelectorAll('.vt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.vt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        grid.className = view === 'list' ? 'calc-list' : 'calc-grid';
      });
    });
  });
}

// ── TOAST NOTIFICATION ────────────────────────────────────────
function showToast(msg) {
  msg = msg || '🚧 Coming soon — bookmark us to be notified!';
  let toast = document.getElementById('ch-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ch-toast';
    toast.className = 'ch-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── FAQ TOGGLE ────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      q.closest('.faq-item').classList.toggle('open');
    });
  });
}

// ── ACTIVE SIDEBAR LINK ───────────────────────────────────────
function setActiveSidebarLink() {
  const page = window.location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if ((link.getAttribute('href') || '').includes(page)) link.classList.add('active');
  });
}

// ── CURRENCY SYSTEM ───────────────────────────────────────────
const CURRENCIES = [
  { code:'USD', symbol:'$',  name:'US Dollar',         flag:'🇺🇸', locale:'en-US'  },
  { code:'EUR', symbol:'€',  name:'Euro',               flag:'🇪🇺', locale:'de-DE'  },
  { code:'GBP', symbol:'£',  name:'British Pound',      flag:'🇬🇧', locale:'en-GB'  },
  { code:'JPY', symbol:'¥',  name:'Japanese Yen',       flag:'🇯🇵', locale:'ja-JP', decimals:0 },
  { code:'CAD', symbol:'$',  name:'Canadian Dollar',    flag:'🇨🇦', locale:'en-CA'  },
  { code:'AUD', symbol:'$',  name:'Australian Dollar',  flag:'🇦🇺', locale:'en-AU'  },
  { code:'CHF', symbol:'Fr', name:'Swiss Franc',        flag:'🇨🇭', locale:'de-CH'  },
  { code:'INR', symbol:'₹',  name:'Indian Rupee',       flag:'🇮🇳', locale:'en-IN'  },
  { code:'CNY', symbol:'¥',  name:'Chinese Yuan',       flag:'🇨🇳', locale:'zh-CN'  },
  { code:'BRL', symbol:'R$', name:'Brazilian Real',     flag:'🇧🇷', locale:'pt-BR'  },
  { code:'MXN', symbol:'$',  name:'Mexican Peso',       flag:'🇲🇽', locale:'es-MX'  },
  { code:'KRW', symbol:'₩',  name:'South Korean Won',   flag:'🇰🇷', locale:'ko-KR', decimals:0 },
  { code:'SGD', symbol:'$',  name:'Singapore Dollar',   flag:'🇸🇬', locale:'en-SG'  },
  { code:'HKD', symbol:'$',  name:'Hong Kong Dollar',   flag:'🇭🇰', locale:'zh-HK'  },
  { code:'SEK', symbol:'kr', name:'Swedish Krona',      flag:'🇸🇪', locale:'sv-SE'  },
  { code:'NOK', symbol:'kr', name:'Norwegian Krone',    flag:'🇳🇴', locale:'nb-NO'  },
  { code:'DKK', symbol:'kr', name:'Danish Krone',       flag:'🇩🇰', locale:'da-DK'  },
  { code:'NZD', symbol:'$',  name:'New Zealand Dollar', flag:'🇳🇿', locale:'en-NZ'  },
  { code:'ZAR', symbol:'R',  name:'South African Rand', flag:'🇿🇦', locale:'en-ZA'  },
  { code:'AED', symbol:'د.إ',name:'UAE Dirham',         flag:'🇦🇪', locale:'ar-AE', decimals:2 },
  { code:'SAR', symbol:'﷼',  name:'Saudi Riyal',        flag:'🇸🇦', locale:'ar-SA', decimals:2 },
  { code:'TRY', symbol:'₺',  name:'Turkish Lira',       flag:'🇹🇷', locale:'tr-TR'  },
  { code:'PLN', symbol:'zł', name:'Polish Złoty',       flag:'🇵🇱', locale:'pl-PL'  },
  { code:'THB', symbol:'฿',  name:'Thai Baht',          flag:'🇹🇭', locale:'th-TH', decimals:0 },
  { code:'IDR', symbol:'Rp', name:'Indonesian Rupiah',  flag:'🇮🇩', locale:'id-ID', decimals:0 },
  { code:'PHP', symbol:'₱',  name:'Philippine Peso',    flag:'🇵🇭', locale:'en-PH'  },
  { code:'MYR', symbol:'RM', name:'Malaysian Ringgit',  flag:'🇲🇾', locale:'ms-MY'  },
  { code:'NGN', symbol:'₦',  name:'Nigerian Naira',     flag:'🇳🇬', locale:'en-NG', decimals:0 },
  { code:'EGP', symbol:'£',  name:'Egyptian Pound',     flag:'🇪🇬', locale:'ar-EG'  },
  { code:'PKR', symbol:'₨',  name:'Pakistani Rupee',    flag:'🇵🇰', locale:'ur-PK', decimals:0 },
];
const CURRENCY_KEY = 'calchub_currency';
let _activeCurrency = null;

function getActiveCurrency() {
  if (_activeCurrency) return _activeCurrency;
  try {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved) _activeCurrency = CURRENCIES.find(c => c.code === saved);
  } catch(e) {}
  if (!_activeCurrency) _activeCurrency = CURRENCIES[0]; // default USD
  return _activeCurrency;
}

function setActiveCurrency(code) {
  const cur = CURRENCIES.find(c => c.code === code);
  if (!cur) return;
  _activeCurrency = cur;
  try { localStorage.setItem(CURRENCY_KEY, code); } catch(e) {}
  updateCurrencyPickerUI();
  updatePageCurrencySymbols();
  // Re-run any active calc on the page
  document.querySelectorAll('.btn-primary').forEach(btn => {
    // only click the main calculate button if result is already showing
    if (btn.closest('.calc-card') && document.querySelector('.result-box.show')) {
      btn.click();
    }
  });
}

// Format a number as currency using active currency
function fmtCurrency(v) {
  const cur = getActiveCurrency();
  const decimals = cur.decimals !== undefined ? cur.decimals : 2;
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: 'currency',
      currency: cur.code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Math.abs(v));
  } catch(e) {
    return cur.symbol + Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
}

// fmtUSD is now an alias for fmtCurrency — all calcs automatically use active currency
function fmtUSD(v) { return fmtCurrency(v); }

// ── CURRENCY PICKER UI ────────────────────────────────────────
function buildCurrencyPicker() {
  const existing = document.getElementById('ch-currency-picker');
  if (existing) return;

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    .ch-currency-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 20px;
      border: 1.5px solid var(--gray-200); background: var(--white);
      font-size: 0.8rem; font-weight: 600; cursor: pointer;
      font-family: 'Inter', sans-serif; color: var(--gray-700);
      transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
    }
    .ch-currency-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
    .ch-currency-flag { font-size: 1rem; line-height: 1; }
    .ch-currency-code { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 700; }
    .ch-currency-chevron { font-size: 9px; color: var(--gray-400); }

    .ch-currency-modal {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 80px;
    }
    .ch-currency-backdrop {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.35); backdrop-filter: blur(3px);
    }
    .ch-currency-panel {
      position: relative; background: var(--white);
      border-radius: 18px; box-shadow: 0 20px 60px rgba(0,0,0,0.18);
      width: min(520px, calc(100vw - 2rem));
      max-height: min(520px, calc(100vh - 100px));
      overflow: hidden; display: flex; flex-direction: column;
      animation: slideDown 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes slideDown { from { opacity:0; transform:translateY(-12px) scale(0.97); } to { opacity:1; transform:none; } }
    .ch-currency-header {
      padding: 1.25rem 1.5rem 1rem;
      border-bottom: 1px solid var(--gray-100);
      display: flex; align-items: center; gap: 10px;
    }
    .ch-currency-header h3 { font-size: 1rem; font-weight: 700; color: var(--gray-900); flex: 1; }
    .ch-currency-close {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--gray-100); border: none; cursor: pointer;
      font-size: 14px; display: flex; align-items: center; justify-content: center;
      color: var(--gray-500); transition: background 0.12s;
    }
    .ch-currency-close:hover { background: var(--gray-200); }
    .ch-currency-search-wrap { padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--gray-100); }
    .ch-currency-search {
      width: 100%; padding: 9px 13px 9px 36px;
      border: 1.5px solid var(--gray-200); border-radius: 22px;
      font-size: 0.875rem; font-family: 'Inter', sans-serif;
      outline: none; background: var(--gray-50);
      transition: border-color 0.2s;
    }
    .ch-currency-search:focus { border-color: var(--blue); background: var(--white); }
    .ch-currency-search-wrap { position: relative; padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--gray-100); }
    .ch-currency-search-icon { position: absolute; left: calc(1.5rem + 11px); top: 50%; transform: translateY(-50%); color: var(--gray-400); font-size: 14px; }
    .ch-currency-list { overflow-y: auto; flex: 1; padding: 0.5rem; }
    .ch-currency-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 10px; cursor: pointer;
      transition: background 0.1s; border: 1.5px solid transparent;
    }
    .ch-currency-item:hover { background: var(--gray-50); }
    .ch-currency-item.active { background: var(--blue-light); border-color: var(--blue-mid); }
    .ch-currency-item-flag { font-size: 1.3rem; line-height: 1; flex-shrink: 0; }
    .ch-currency-item-info { flex: 1; min-width: 0; }
    .ch-currency-item-name { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .ch-currency-item-code { font-size: 0.72rem; color: var(--gray-400); font-family: 'JetBrains Mono', monospace; margin-top: 1px; }
    .ch-currency-item-sym { font-size: 1rem; font-weight: 700; color: var(--gray-400); font-family: 'JetBrains Mono', monospace; flex-shrink: 0; min-width: 24px; text-align: right; }
    .ch-currency-item.active .ch-currency-item-name { color: var(--blue); }
    .ch-currency-item.active .ch-currency-check { display: block; }
    .ch-currency-check { display: none; color: var(--blue); font-size: 14px; flex-shrink: 0; }
    .ch-popular-label { font-size: 0.65rem; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.1em; padding: 8px 12px 4px; }
    .ch-currency-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 0 0.5rem 0.5rem; }
    .ch-quick-btn {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      padding: 8px 6px; border-radius: 10px; border: 1.5px solid var(--gray-200);
      background: var(--white); cursor: pointer; font-family: 'Inter', sans-serif;
      transition: all 0.12s;
    }
    .ch-quick-btn:hover { border-color: var(--blue); background: var(--blue-light); }
    .ch-quick-btn.active { border-color: var(--blue); background: var(--blue-light); }
    .ch-quick-flag { font-size: 1.2rem; }
    .ch-quick-code { font-size: 0.65rem; font-weight: 700; color: var(--gray-600); font-family: 'JetBrains Mono', monospace; }
  `;
  document.head.appendChild(style);

  // Button in header
  const headerNav = document.querySelector('.header-nav');
  if (headerNav) {
    const btn = document.createElement('button');
    btn.id = 'ch-currency-btn';
    btn.className = 'ch-currency-btn';
    btn.onclick = openCurrencyPicker;
    headerNav.parentNode.insertBefore(btn, headerNav);
  }

  updateCurrencyPickerUI();
}

function updateCurrencyPickerUI() {
  const cur = getActiveCurrency();
  const btn = document.getElementById('ch-currency-btn');
  if (btn) btn.innerHTML = `<span class="ch-currency-flag">${cur.flag}</span><span class="ch-currency-code">${cur.code}</span><span class="ch-currency-chevron">▾</span>`;
}

function openCurrencyPicker() {
  const cur = getActiveCurrency();
  const modal = document.createElement('div');
  modal.id = 'ch-currency-picker';
  modal.className = 'ch-currency-modal';

  const POPULAR = ['USD','EUR','GBP','JPY','CAD','AUD','INR','CNY'];

  modal.innerHTML = `
    <div class="ch-currency-backdrop" onclick="closeCurrencyPicker()"></div>
    <div class="ch-currency-panel">
      <div class="ch-currency-header">
        <h3>🌍 Choose Currency</h3>
        <button class="ch-currency-close" onclick="closeCurrencyPicker()">✕</button>
      </div>
      <div class="ch-currency-search-wrap">
        <span class="ch-currency-search-icon">⌕</span>
        <input class="ch-currency-search" id="ch-currency-search-input" placeholder="Search currencies…" autocomplete="off" oninput="filterCurrencies(this.value)" autofocus/>
      </div>
      <div class="ch-currency-list" id="ch-currency-list">
        <div class="ch-popular-label">Popular</div>
        <div class="ch-currency-grid" id="ch-currency-quick">
          ${POPULAR.map(code => {
            const c = CURRENCIES.find(x => x.code === code);
            return `<button class="ch-quick-btn${c.code===cur.code?' active':''}" onclick="selectCurrency('${c.code}')">
              <span class="ch-quick-flag">${c.flag}</span>
              <span class="ch-quick-code">${c.code}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="ch-popular-label" style="margin-top:6px;">All Currencies</div>
        <div id="ch-currency-all">${renderCurrencyItems(CURRENCIES, cur.code)}</div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function renderCurrencyItems(list, activeCode) {
  return list.map(c => `
    <div class="ch-currency-item${c.code===activeCode?' active':''}" onclick="selectCurrency('${c.code}')">
      <div class="ch-currency-item-flag">${c.flag}</div>
      <div class="ch-currency-item-info">
        <div class="ch-currency-item-name">${c.name}</div>
        <div class="ch-currency-item-code">${c.code}</div>
      </div>
      <div class="ch-currency-item-sym">${c.symbol}</div>
      <span class="ch-currency-check">✓</span>
    </div>`).join('');
}

function filterCurrencies(q) {
  const cur = getActiveCurrency();
  const filtered = q ? CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.code.toLowerCase().includes(q.toLowerCase()) ||
    c.symbol.includes(q)
  ) : CURRENCIES;
  const el = document.getElementById('ch-currency-all');
  if (el) el.innerHTML = renderCurrencyItems(filtered, cur.code);
  const quick = document.getElementById('ch-currency-quick');
  if (quick) quick.style.display = q ? 'none' : '';
}

function selectCurrency(code) {
  setActiveCurrency(code);
  closeCurrencyPicker();
  showToast(`Currency set to ${code}`);
}

function closeCurrencyPicker() {
  const modal = document.getElementById('ch-currency-picker');
  if (modal) modal.remove();
}

// ── FORMAT HELPERS ────────────────────────────────────────────
function fmtCurrency(v) {
  const cur = getActiveCurrency();
  const decimals = cur.decimals !== undefined ? cur.decimals : 2;
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: 'currency', currency: cur.code,
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
    }).format(Math.abs(v));
  } catch(e) {
    return cur.symbol + Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
}
function fmtUSD(v) { return fmtCurrency(v); }   // all calc pages use fmtUSD — automatically picks active currency
function fmtInt(v) { return Math.round(v).toLocaleString('en-US'); }
function fmtPct(v) { return v.toFixed(2) + '%'; }
function fmtPctRound(v) { return Math.round(v * 10) / 10 + '%'; }
function el(id) { return document.getElementById(id); }
function showResult(id) { const b = el(id); if (b) { b.classList.add('show'); b.scrollIntoView({ behavior:'smooth', block:'nearest' }); } }
function setText(id, text) { const n = el(id); if (n) n.textContent = text; }

// ── BAR CHART ─────────────────────────────────────────────────
// ── DONUT CHART ───────────────────────────────────────────────
function renderDonutChart(containerId, items, centerLabel, centerValue) {
  const container = el(containerId);
  if (!container) return;
  const total = items.reduce((s, i) => s + Math.abs(i.value), 0);
  if (!total) return;
  const SIZE = 140, CX = SIZE/2, CY = SIZE/2, R = 52, STROKE = 22;
  let offset = 0;
  const CIRC = 2 * Math.PI * R;
  const paths = items.map(item => {
    const pct   = Math.abs(item.value) / total;
    const dash  = (pct * CIRC).toFixed(2);
    const gap   = (CIRC - pct * CIRC).toFixed(2);
    const rot   = (offset * 360 - 90).toFixed(2);
    offset += pct;
    return `<circle cx="${CX}" cy="${CY}" r="${R}"
      fill="none" stroke="${item.color}" stroke-width="${STROKE}"
      stroke-dasharray="${dash} ${gap}"
      stroke-dashoffset="0"
      transform="rotate(${rot} ${CX} ${CY})"
      stroke-linecap="butt"/>`;
  }).join('');
  const legend = items.map(item => {
    const pct = (Math.abs(item.value)/total*100).toFixed(1);
    return `<div class="donut-legend-item">
      <div class="donut-dot" style="background:${item.color}"></div>
      <div class="donut-legend-label">${item.label}</div>
      <div class="donut-legend-value">${item.display} <span style="font-size:0.68rem;color:var(--gray-400);font-weight:400;">${pct}%</span></div>
    </div>`;
  }).join('');
  container.innerHTML = `
    <div class="donut-wrap">
      <div style="position:relative;flex-shrink:0;">
        <svg width="${SIZE}" height="${SIZE}" class="donut-svg" viewBox="0 0 ${SIZE} ${SIZE}">
          <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="var(--gray-100)" stroke-width="${STROKE}"/>
          ${paths}
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
          <div style="font-size:0.65rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.06em;line-height:1;">${centerLabel||''}</div>
          <div style="font-size:0.95rem;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--gray-900);line-height:1.2;margin-top:3px;">${centerValue||''}</div>
        </div>
      </div>
      <div class="donut-legend">${legend}</div>
    </div>`;
}

// ── BAR CHART ─────────────────────────────────────────────────
function renderBarChart(containerId, items) {
  const container = el(containerId);
  if (!container) return;
  const max = Math.max(...items.map(i => Math.abs(i.value)), 1);
  container.innerHTML = `<div class="bar-chart">` + items.map(i => `
    <div class="bar-row">
      <div class="bar-label">${i.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(Math.abs(i.value)/max*100).toFixed(1)}%;background:${i.color};"></div></div>
      <div class="bar-value">${i.display}</div>
    </div>`).join('') + `</div>`;
}

// ── STANDARD CALCULATOR ENGINE ────────────────────────────────
function makeCalcState() { return { val:'0', expr:'', op:null, prev:null, reset:false }; }
function calcEngine(state, key, dispId, exprId) {
  const disp = el(dispId); const expr = el(exprId);
  if (!disp) return;
  if (key === 'C') { Object.assign(state, makeCalcState()); }
  else if (key === '+/-') { if (state.val !== '0') state.val = state.val.startsWith('-') ? state.val.slice(1) : '-' + state.val; }
  else if (key === '%') { state.val = String(parseFloat(state.val) / 100); }
  else if (['+','−','×','÷'].includes(key)) { state.prev = parseFloat(state.val); state.op = key; state.expr = state.val + ' ' + key; state.reset = true; }
  else if (key === '=') {
    if (state.op !== null && state.prev !== null) {
      const cur = parseFloat(state.val); let res;
      switch(state.op) { case '+': res = state.prev+cur; break; case '−': res = state.prev-cur; break; case '×': res = state.prev*cur; break; case '÷': res = cur===0?null:state.prev/cur; break; }
      state.expr = state.expr + ' ' + state.val + ' =';
      state.val = res === null ? 'Error' : String(+parseFloat(res).toFixed(10));
      state.op = null; state.prev = null; state.reset = true;
    }
  } else if (key === '.') {
    if (state.reset) { state.val = '0.'; state.reset = false; }
    else if (!state.val.includes('.')) state.val += '.';
  } else {
    if (state.val === '0' || state.reset) { state.val = key; state.reset = false; }
    else if (state.val.length < 14) state.val += key;
  }
  disp.textContent = state.val;
  if (expr) expr.textContent = state.expr;
}

// ── GRID RENDERER ─────────────────────────────────────────────
function renderGrid(containerId, calcs, rootPrefix) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = calcs.map(c => {
    if (c.soon) return `
      <span class="calc-card-link calc-card-soon" onclick="showToast()">
        <div class="card-icon">${c.icon}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-desc">${c.desc}</div>
        <span class="card-badge badge-soon">Coming Soon</span>
      </span>`;
    return `
      <a class="calc-card-link" href="${rootPrefix}${c.id}.html">
        <div class="card-icon">${c.icon}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-desc">${c.desc}</div>
        ${c.popular ? '<span class="card-badge badge-popular">Popular</span>' : ''}
      </a>`;
  }).join('');
}

function renderList(containerId, calcs, rootPrefix) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = calcs.map(c => {
    if (c.soon) return `<span class="calc-list-item calc-list-soon" onclick="showToast()">${c.icon} ${c.name} <span class="list-soon-badge">Soon</span></span>`;
    return `<a class="calc-list-item" href="${rootPrefix}${c.id}.html">${c.icon} ${c.name}</a>`;
  }).join('');
}

// ── INIT ON LOAD ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSearch('header-search-input', 'header-search-dropdown');
  initFAQ();
  setActiveSidebarLink();
  initKeyboardShortcuts();
  initViewToggles();
  buildCurrencyPicker();
  updatePageCurrencySymbols();
  if (typeof renderRecentStrip === 'function') renderRecentStrip();
});

// ── DYNAMIC CURRENCY SYMBOLS ──────────────────────────────────
// Updates all $ prefixes/suffixes in the page to match active currency symbol
function updatePageCurrencySymbols() {
  const cur = getActiveCurrency();
  document.querySelectorAll('.input-prefix').forEach(el => {
    if (el.dataset.currencySymbol || el.textContent.trim() === '$' || el.textContent.trim() === '€' || el.textContent.trim() === '£' || el.textContent.trim() === '¥' || el.textContent.trim() === '₹' || el.textContent.trim() === '₩') {
      el.dataset.currencySymbol = '1';
      el.textContent = cur.symbol;
    }
  });
}

// ══════════════════════════════════════════════════════════════
//  AI EXPLAIN SYSTEM
// ══════════════════════════════════════════════════════════════

const AI_STYLES = `
.ai-explain-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 24px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff; border: none; cursor: pointer;
  font-size: 0.85rem; font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s; margin-top: 1rem;
  box-shadow: 0 2px 12px rgba(124,58,237,0.3);
  width: 100%;
  justify-content: center;
}
.ai-explain-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
.ai-explain-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.ai-explain-btn .ai-icon { font-size: 1rem; }
.ai-explain-btn .ai-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.ai-result-box {
  margin-top: 1rem;
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
  border: 1.5px solid #d8b4fe;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: none;
  animation: fadeIn 0.3s ease;
}
.ai-result-box.show { display: block; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
.ai-result-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 0.75rem; font-size: 0.78rem;
  font-weight: 700; color: #7c3aed;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.ai-result-text {
  font-size: 0.9rem; color: #374151; line-height: 1.8;
  white-space: pre-wrap;
}
.ai-result-text strong { color: #1f2937; }
.ai-result-footer {
  margin-top: 0.75rem; font-size: 0.7rem;
  color: #9ca3af; display: flex; align-items: center; gap: 5px;
}

.ai-problem-box {
  background: linear-gradient(135deg, #faf5ff, #f0f9ff);
  border: 1.5px solid #c4b5fd;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}
.ai-problem-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;
}
.ai-problem-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.ai-problem-title { font-size: 0.95rem; font-weight: 700; color: #1f2937; }
.ai-problem-sub   { font-size: 0.75rem; color: #6b7280; margin-top: 2px; }
.ai-problem-input {
  width: 100%; padding: 11px 14px;
  border: 1.5px solid #c4b5fd; border-radius: 12px;
  font-size: 0.9rem; font-family: 'Inter', sans-serif;
  outline: none; background: #fff;
  transition: border-color 0.2s;
  resize: vertical; min-height: 70px;
  color: #1f2937;
  box-sizing: border-box;
}
.ai-problem-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
.ai-problem-examples {
  display: flex; flex-wrap: wrap; gap: 6px; margin: 0.75rem 0;
}
.ai-problem-example {
  padding: 5px 12px; border-radius: 16px;
  background: #ede9fe; color: #7c3aed;
  font-size: 0.75rem; font-weight: 500;
  cursor: pointer; border: 1px solid #c4b5fd;
  transition: all 0.12s; font-family: 'Inter', sans-serif;
}
.ai-problem-example:hover { background: #ddd6fe; }
.ai-solve-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: 24px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff; border: none; cursor: pointer;
  font-size: 0.875rem; font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(124,58,237,0.3);
}
.ai-solve-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
.ai-solve-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }

.ai-promo-banner {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
  border-radius: 16px; padding: 1.5rem 2rem;
  display: flex; align-items: center; gap: 1.5rem;
  margin: 1.5rem 0; flex-wrap: wrap;
  box-shadow: 0 4px 20px rgba(124,58,237,0.25);
}
.ai-promo-left { flex: 1; min-width: 200px; }
.ai-promo-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(167,139,250,0.2); border: 1px solid rgba(167,139,250,0.4);
  color: #c4b5fd; border-radius: 20px;
  font-size: 0.68rem; font-weight: 700;
  padding: 3px 10px; margin-bottom: 0.6rem;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.ai-promo-title { font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.ai-promo-desc  { font-size: 0.82rem; color: rgba(255,255,255,0.6); line-height: 1.55; }
.ai-promo-right { flex-shrink: 0; }
.ai-promo-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 22px;
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: #fff; border: none; cursor: pointer;
  font-size: 0.875rem; font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(124,58,237,0.4);
  white-space: nowrap;
}
.ai-promo-btn:hover { box-shadow: 0 6px 20px rgba(124,58,237,0.5); transform: translateY(-1px); }
`;

// Inject styles once
function injectAIStyles() {
  if (document.getElementById('ai-styles')) return;
  const s = document.createElement('style');
  s.id = 'ai-styles';
  s.textContent = AI_STYLES;
  document.head.appendChild(s);
}

// ── CALL GEMINI VIA NETLIFY FUNCTION ─────────────────────────
async function callAI(prompt) {
  const res = await fetch('/.netlify/functions/ai-explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('AI request failed');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ── EXPLAIN RESULT BUTTON ─────────────────────────────────────
// Call this from each calculator page after showing results
// context = { calc: 'Mortgage', inputs: {...}, outputs: {...} }
function injectExplainButton(resultBoxId, context) {
  injectAIStyles();
  const box = document.getElementById(resultBoxId);
  if (!box || box.querySelector('.ai-explain-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'ai-explain-btn';
  btn.innerHTML = '<span class="ai-icon">✨</span> Explain my result with AI';
  btn.onclick = () => explainResult(btn, context);

  const aiBox = document.createElement('div');
  aiBox.id = resultBoxId + '-ai';
  aiBox.className = 'ai-result-box';

  box.appendChild(btn);
  box.appendChild(aiBox);
}

async function explainResult(btn, context) {
  const aiBoxId = btn.nextSibling.id;
  const aiBox = document.getElementById(aiBoxId);
  btn.disabled = true;
  btn.innerHTML = '<span class="ai-spinner"></span> Thinking…';

  const cur = typeof getActiveCurrency === 'function' ? getActiveCurrency() : { code:'USD' };
  const prompt = `You are a friendly financial and math advisor. A user just used a ${context.calc} calculator.

Their inputs: ${JSON.stringify(context.inputs)}
Their results: ${JSON.stringify(context.outputs)}
Currency: ${cur.code}

In 3–5 short paragraphs, plain English:
1. Summarize what their result means in real life
2. Whether it looks healthy/affordable/on-track (give your honest take)
3. One or two practical tips specific to their numbers
4. Any important caveats

Be warm, specific to their actual numbers, and avoid generic advice. No bullet points — flowing paragraphs only. Keep it under 250 words.`;

  try {
    const result = await callAI(prompt);
    aiBox.innerHTML = `
      <div class="ai-result-header">✨ AI Explanation</div>
      <div class="ai-result-text">${result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
      <div class="ai-result-footer">⚡ Powered by Google Gemini · For guidance only, not financial advice</div>`;
    aiBox.classList.add('show');
    btn.innerHTML = '<span class="ai-icon">✨</span> Explain again';
    btn.disabled = false;
  } catch(e) {
    aiBox.innerHTML = `<div class="ai-result-text" style="color:#dc2626;">Sorry, AI is unavailable right now. Please try again in a moment.</div>`;
    aiBox.classList.add('show');
    btn.innerHTML = '<span class="ai-icon">✨</span> Try again';
    btn.disabled = false;
  }
}

// ── EXPLAIN THE PROBLEM BOX ────────────────────────────────────
function injectProblemBox(containerId, calcName, examples) {
  injectAIStyles();
  const container = document.getElementById(containerId);
  if (!container) return;

  const defaultExamples = examples || [
    'What mortgage can I afford on $80k salary?',
    'Is a 7% interest rate too high for a car loan?',
    'Should I pay off debt or invest?',
    'How much do I need to retire at 60?'
  ];

  container.innerHTML = `
    <div class="ai-problem-box">
      <div class="ai-problem-header">
        <div class="ai-problem-icon">🤖</div>
        <div>
          <div class="ai-problem-title">Ask AI anything about ${calcName}</div>
          <div class="ai-problem-sub">Get a plain-English explanation of any financial concept or scenario</div>
        </div>
      </div>
      <div class="ai-problem-examples">
        ${defaultExamples.map(e => `<button class="ai-problem-example" onclick="document.getElementById('ai-problem-input').value=this.textContent">${e}</button>`).join('')}
      </div>
      <textarea id="ai-problem-input" class="ai-problem-input" placeholder="Ask anything… e.g. 'What does amortization mean?' or 'Is my mortgage payment too high?'"></textarea>
      <div style="display:flex;gap:10px;margin-top:0.75rem;flex-wrap:wrap;align-items:center;">
        <button class="ai-solve-btn" onclick="solveProblem('${calcName}')">
          <span>✨</span> Get AI Answer
        </button>
        <span style="font-size:0.72rem;color:#9ca3af;">Free · Powered by Gemini</span>
      </div>
      <div id="ai-problem-result" class="ai-result-box" style="margin-top:1rem;"></div>
    </div>`;
}

async function solveProblem(calcName) {
  const input = document.getElementById('ai-problem-input');
  const resultBox = document.getElementById('ai-problem-result');
  const btn = document.querySelector('.ai-solve-btn');
  const question = input.value.trim();
  if (!question) { input.focus(); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="ai-spinner" style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin 0.7s linear infinite;"></span> Thinking…';

  const prompt = `You are a helpful, friendly expert on ${calcName} calculations and personal finance.

A user asks: "${question}"

Answer in plain English, 2–4 paragraphs. Be specific, practical, and honest. 
If it's a math question, show the key formula simply. 
If it's advice, be balanced and mention when they should consult a professional.
No bullet points — flowing paragraphs only. Under 200 words.`;

  try {
    const result = await callAI(prompt);
    resultBox.innerHTML = `
      <div class="ai-result-header">✨ AI Answer</div>
      <div class="ai-result-text">${result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
      <div class="ai-result-footer">⚡ Powered by Google Gemini · For guidance only</div>`;
    resultBox.classList.add('show');
  } catch(e) {
    resultBox.innerHTML = `<div class="ai-result-text" style="color:#dc2626;">AI unavailable right now. Please try again.</div>`;
    resultBox.classList.add('show');
  }
  btn.disabled = false;
  btn.innerHTML = '<span>✨</span> Get AI Answer';
}

// ── AI PROMO BANNER (inject anywhere) ────────────────────────
function injectAIPromoBanner(containerId, scrollTargetId) {
  injectAIStyles();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="ai-promo-banner">
      <div class="ai-promo-left">
        <div class="ai-promo-badge">✨ New · AI-Powered</div>
        <div class="ai-promo-title">Get a plain-English explanation of your result</div>
        <div class="ai-promo-desc">Our AI reads your exact numbers and explains what they mean in real life — not generic advice, your specific situation.</div>
      </div>
      <div class="ai-promo-right">
        <button class="ai-promo-btn" onclick="document.getElementById('${scrollTargetId}').scrollIntoView({behavior:'smooth'})">
          ✨ Try AI Explain
        </button>
      </div>
    </div>`;
}
