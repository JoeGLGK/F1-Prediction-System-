const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwZ_VB9I7ClOgDpd8bDkaY09CzipETJMeQPDK6Qk6JYVNPdgfXA6ZrmXDG8gYsJ9I6u/exec";

async function callGAS(action, payload = {}) {
  const response = await fetch(GAS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ action: action }, payload))
  });
  return await response.json();
}

function showToast(msg, type='success') { 
  const c = document.getElementById('f1ToastContainer'); 
  if(!c) return; 
  const t = document.createElement('div'); 
  t.className = 'f1-toast ' + type; 
  t.innerHTML = (type==='success'?'✅':'⚠️') + ' <span>' + msg + '</span>'; 
  c.appendChild(t); 
  setTimeout(function() { t.remove(); }, 4700); 
}

function triggerHaptic() { 
  if (navigator.vibrate) navigator.vibrate(40); 
}

const TEAM_LOGOS = { 
  "Ferrari": "https://lh3.googleusercontent.com/d/1vSyLK4voiZIq9-ctG7X5aAkdPezha1xu", 
  "Red Bull Racing": "https://lh3.googleusercontent.com/d/1pM-9Vo3HyaA-ZL5bjavA0D9nNYoClRAv", 
  "McLaren": "https://lh3.googleusercontent.com/d/1EhsPjx5G3tVpXROG9x5Eos7xYXTIUKMf", 
  "Mercedes": "https://lh3.googleusercontent.com/d/1i-5H1bNHXpX3Jt7ZciAP3gmV5QjtAwlF", 
  "Aston Martin": "https://lh3.googleusercontent.com/d/1smqEEy8i7d1AbQmqVXR68hD1qP0Qwx1p", 
  "Alpine": "https://lh3.googleusercontent.com/d/1CAPj3vwXe7cWOuxBPhOX-ciiJ8FlGqFG", 
  "Williams": "https://lh3.googleusercontent.com/d/18mn901TW_w5SW4Fg5Ke0WBKgxyt-5ICN", 
  "VCARB": "https://lh3.googleusercontent.com/d/1AfEAprJx9b4ivULrg41CCYiVUnBi6ps2", 
  "Audi": "https://lh3.googleusercontent.com/d/1w0dvPdMVK2b09liK6G-XEt2LXu6S-Mt0", 
  "Sauber": "https://lh3.googleusercontent.com/d/1w0dvPdMVK2b09liK6G-XEt2LXu6S-Mt0", 
  "Haas": "https://lh3.googleusercontent.com/d/1i7aUDygqHB5Qf0ySyWIUSzy0F-YW8jHz", 
  "Cadilac": "https://lh3.googleusercontent.com/d/1GIArchbZm5K7bmSNfpkGNi8bHae5G1w0",
  "Cadillac": "https://lh3.googleusercontent.com/d/1GIArchbZm5K7bmSNfpkGNi8bHae5G1w0"
};

const TEAM_COLORS = { 
  "Ferrari": "#e10600", 
  "Red Bull Racing": "#3671c6", 
  "McLaren": "#ff8000", 
  "Mercedes": "#27f4d2", 
  "Aston Martin": "#229971", 
  "Alpine": "#ff87bc", 
  "Williams": "#005aff", 
  "VCARB": "#6692ff", 
  "Audi": "#00e701", 
  "Sauber": "#00e701", 
  "Haas": "#ffffff", 
  "Cadilac": "#ffd700",
  "Cadillac": "#ffd700" 
};

// ลิงก์รูปรถ F1 ของแต่ละทีม
const TEAM_CARS = {
  "Ferrari": "https://lh3.googleusercontent.com/d/16fGNY2kTdnXIoDRjzkXmpbZwOn27xAAR",
  "Red Bull Racing": "https://lh3.googleusercontent.com/d/1MUwr4Pi3TbBAKIYefrPpVcmfqdqfe-OW",
  "McLaren": "https://lh3.googleusercontent.com/d/1ZFP_jPxbzfRLknkRWj_GhEHRbkBK-l6g",
  "Mercedes": "https://lh3.googleusercontent.com/d/1y_4syJ21I8PbkQ5-O8VCnkKfNMO8_t0d",
  "Aston Martin": "https://lh3.googleusercontent.com/d/17A9qzj-jYzgwDwxZxsUyhj3aZZr9XHSn",
  "Alpine": "https://lh3.googleusercontent.com/d/1VB8NbkZMwYaQpXAskv98bSpaZ97zRR3b",
  "Williams": "https://lh3.googleusercontent.com/d/1CyrgK3KDX9C__EYuUwr9o5Qj-_LRnaQh",
  "VCARB": "https://lh3.googleusercontent.com/d/11EsP5GQrWqpBv68QWc3UPahhHuWydoMX",
  "Audi": "https://lh3.googleusercontent.com/d/1lqDE-G4e6rTrFXybJi2BH2NwBrWUm8X3",
  "Sauber": "https://lh3.googleusercontent.com/d/1lqDE-G4e6rTrFXybJi2BH2NwBrWUm8X3",
  "Haas": "https://lh3.googleusercontent.com/d/1dNjNrpTi-BznASYs9cRjjQmnILOdfhxK",
  "Cadilac": "https://lh3.googleusercontent.com/d/109l7yKIfGsfABg0R5sSh35yu3aq2DAwq",
  "Cadillac": "https://lh3.googleusercontent.com/d/109l7yKIfGsfABg0R5sSh35yu3aq2DAwq"
};

const DEFAULT_DRIVER_IMG = "https://cdn-icons-png.flaticon.com/512/1995/1995470.png";

const DRIVER_INFO = {
  "Kimi Antonelli": { team: "Mercedes", color: "#27f4d2", img: "https://lh3.googleusercontent.com/d/1XueMkRyOLH6YggOKxiU__FNxc1oxOhO7" },
  "George Russell": { team: "Mercedes", color: "#27f4d2", img: "https://lh3.googleusercontent.com/d/1wineMhWS2aqA68eErrDxvikfopeorSKD" },
  "Max Verstappen": { team: "Red Bull Racing", color: "#3671c6", img: "https://lh3.googleusercontent.com/d/1FIH6Hjzdr9KKxf5yYYgpFJzX2GJmp5MZ" },
  "Isack Hadjar": { team: "Red Bull Racing", color: "#3671c6", img: "https://lh3.googleusercontent.com/d/1eR94vK-62qi7bDucBnuvHNicUcve06SA" },
  "Lando Norris": { team: "McLaren", color: "#ff8000", img: "https://lh3.googleusercontent.com/d/15gZwBnLjfhkbT2jwoXq0oe53DoinzLUR" },
  "Oscar Piastri": { team: "McLaren", color: "#ff8000", img: "https://lh3.googleusercontent.com/d/1LZaV4wfjgXtaN35WgxwuzZiE2HdCfFbs" },
  "Lewis Hamilton": { team: "Ferrari", color: "#e10600", img: "https://lh3.googleusercontent.com/d/1lZb4XYfCoxHyZnaqkaUoUbET1z8W6pKz" },
  "Charles Leclerc": { team: "Ferrari", color: "#e10600", img: "https://lh3.googleusercontent.com/d/1E1xYy5TP1ei7CqBNFsU-MI0Evr3w2sK4" },
  "Liam Lawson": { team: "VCARB", color: "#6692ff", img: "https://lh3.googleusercontent.com/d/11RZ7qdc_blnLI4QmWTFOq2b-ontSKjnR" },
  "Arvid Lindblad": { team: "VCARB", color: "#6692ff", img: "https://lh3.googleusercontent.com/d/1SMM0ioYV1iuDY3IdjeILDHcyrz585RLx" },
  "Nico Hülkenberg": { team: "Audi", color: "#00e701", img: "https://lh3.googleusercontent.com/d/1gAGhigxnQpFXRJzmomddT1pdQgxrflJO" },
  "Gabriel Bortoleto": { team: "Audi", color: "#00e701", img: "https://lh3.googleusercontent.com/d/1rQQ2uxUgKw1YMqLFndjIAhNHvbTC31qI" },
  "Oliver Bearman": { team: "Haas", color: "#ffffff", img: "https://lh3.googleusercontent.com/d/1y32Nd5CGiQQL9LVXW2Yyg-uBGCdE62QL" },
  "Esteban Ocon": { team: "Haas", color: "#ffffff", img: "https://lh3.googleusercontent.com/d/1dIYK5u651tz4uFLXElJY7RijV4EKRBGd" },
  "Carlos Sainz": { team: "Williams", color: "#005aff", img: "https://lh3.googleusercontent.com/d/1xpTy6YAwaPPA1NOHQdg3SttuEi0T1TsW" },
  "Alexander Albon": { team: "Williams", color: "#005aff", img: "https://lh3.googleusercontent.com/d/1LnzHzqrhNAL1l3w7mVtr-iKTD4Rk06gw" },
  "Pierre Gasly": { team: "Alpine", color: "#ff87bc", img: "https://lh3.googleusercontent.com/d/1maqM4IhIgFkmRQ_KelrWPQraNPO_qu5_" },
  "Franco Colapinto": { team: "Alpine", color: "#ff87bc", img: "https://lh3.googleusercontent.com/d/1Fnl0mVNwXZZC41s0SQU9AqAwQkD1f198" },
  "Fernando Alonso": { team: "Aston Martin", color: "#229971", img: "https://lh3.googleusercontent.com/d/1b9pCYfexGdOmo8fLfDTiH4spH5lXJrLU" },
  "Lance Stroll": { team: "Aston Martin", color: "#229971", img: "https://lh3.googleusercontent.com/d/1VCHnoTG4I8LiJL6AxBMnsXGJU4jpLbAi" },
  "Sergio Pérez": { team: "Cadillac", color: "#ffd700", img: "https://lh3.googleusercontent.com/d/1DAVP6b75_8Y0v4LEfCKnXlNxnKhOgHBh" },
  "Valtteri Bottas": { team: "Cadillac", color: "#ffd700", img: "https://lh3.googleusercontent.com/d/1j_esvm_OfYqmfPB4lsKvbfPZUMO3FvCq" }
};

const DRIVERS = Object.keys(DRIVER_INFO);

let secretClicks = 0; 
let clickTimer = null; 
let adminModalInstance = null; 
let statsModalInstance = null; 
let breakdownModalInstance = null; 
let regModalInstance = null; 
let loginGateModalInstance = null; 
let imagePreviewModalInstance = null; 
let driverSelectorModalInstance = null;
let currentSelectingSlot = null;
let countdownInterval = null; 
let currentDeadline = null; 
let globalLeaderboard = []; 
let globalPlayers = []; 
let globalRaces = []; 
let lastPendingList = []; 
let currentActiveMedia = null;
let isRefreshing = false;

window.onload = function() {
  adminModalInstance = new bootstrap.Modal(document.getElementById('adminModal')); 
  statsModalInstance = new bootstrap.Modal(document.getElementById('statsModal')); 
  breakdownModalInstance = new bootstrap.Modal(document.getElementById('breakdownModal')); 
  regModalInstance = new bootstrap.Modal(document.getElementById('regModal')); 
  loginGateModalInstance = new bootstrap.Modal(document.getElementById('loginGateModal')); 
  imagePreviewModalInstance = new bootstrap.Modal(document.getElementById('imagePreviewModal'));

  const driverModalEl = document.getElementById('driverSelectorModal');
  if (driverModalEl) {
    driverSelectorModalInstance = new bootstrap.Modal(driverModalEl);
  }

  const optHtml = '<option value="" disabled selected>-- เลือกนักแข่ง --</option>' + DRIVERS.map(function(d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');
  document.querySelectorAll('.driver-opt').forEach(function(el) { el.innerHTML = optHtml; });

  buildDriverGrid();
  loadData();
};

function buildDriverGrid() {
  const container = document.getElementById('driverGridContainer');
  if (!container) return;
  let html = '';
  DRIVERS.forEach(function(name) {
    const info = DRIVER_INFO[name] || { team: "F1", color: "#888888", img: DEFAULT_DRIVER_IMG };
    const safeName = name.replace(/'/g, "\\'");
    html += '<div class="driver-pick-btn" style="--team-color: ' + info.color + '" onclick="confirmSelectDriver(\'' + safeName + '\')">' +
              '<div class="driver-pick-name">' + name + '</div>' +
              '<div class="driver-pick-team">' + info.team + '</div>' +
              '<img src="' + getDriveDirectLink(info.img) + '" class="driver-pick-img" alt="' + name + '">' +
            '</div>';
  });
  container.innerHTML = html;
}

function openDriverSelector(slotId) {
  triggerHaptic();
  currentSelectingSlot = slotId;
  const titles = { 
    'pos1': 'P1 (อันดับที่ 1)', 
    'pos2': 'P2 (อันดับที่ 2)', 
    'pos3': 'P3 (อันดับที่ 3)', 
    'pos4': 'P4 (อันดับที่ 4)', 
    'posFL': 'Fastest Lap' 
  };
  const titleEl = document.getElementById('driverSelectorTitle');
  if (titleEl) {
    titleEl.innerHTML = '<i class="fa-solid fa-helmet-safety text-danger me-2"></i>เลือกนักแข่งสำหรับ ' + (titles[slotId] || '');
  }
  if (driverSelectorModalInstance) {
    driverSelectorModalInstance.show();
  }
}

function confirmSelectDriver(driverName) {
  triggerHaptic();
  if (!currentSelectingSlot) return;
  const selectEl = document.getElementById(currentSelectingSlot);
  if (selectEl) selectEl.value = driverName;
  updateCardUI(currentSelectingSlot, driverName);
  if (driverSelectorModalInstance) {
    driverSelectorModalInstance.hide();
  }
}

function updateCardUI(slotId, driverName) {
  const card = document.getElementById('card-' + slotId);
  if (!card) return;
  const emptyState = card.querySelector('.slot-empty-state');
  const filledState = card.querySelector('.slot-filled-state');

  if (!driverName) {
    card.classList.remove('filled');
    emptyState.classList.remove('d-none');
    filledState.classList.add('d-none');
    return;
  }

  const info = DRIVER_INFO[driverName] || { team: "F1", color: "#e10600", img: DEFAULT_DRIVER_IMG };
  card.classList.add('filled');
  card.style.setProperty('--team-color', info.color);

  document.getElementById('name-' + slotId).innerText = driverName;
  document.getElementById('team-' + slotId).innerText = info.team;
  document.getElementById('img-' + slotId).src = getDriveDirectLink(info.img);

  const watermarkEl = document.getElementById('watermark-' + slotId);
  if (watermarkEl) {
    watermarkEl.src = getDriveDirectLink(TEAM_LOGOS[info.team] || "");
  }

  emptyState.classList.add('d-none');
  filledState.classList.remove('d-none');
}

function registerSecretClick() { 
  triggerHaptic(); 
  secretClicks++; 
  clearTimeout(clickTimer); 
  if (secretClicks >= 5) { 
    secretClicks = 0; 
    openAdminModal(); 
  } else { 
    clickTimer = setTimeout(function() { secretClicks = 0; }, 2000); 
  } 
}

function openAdminModal() { adminModalInstance.show(); } 
function openRegisterModal() { regModalInstance.show(); } 
function openLoginGateModal() { loginGateModalInstance.show(); }

function getDriveDirectLink(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return 'https://lh3.googleusercontent.com/d/' + match[1];
  }
  return url; 
}

function openMediaPreview(type) { 
  triggerHaptic(); 
  if (!currentActiveMedia || !currentActiveMedia[type]) { 
    showToast('ไม่มีรูป', 'error'); 
    return; 
  } 
  document.getElementById('previewImageSrc').src = getDriveDirectLink(currentActiveMedia[type]); 
  imagePreviewModalInstance.show(); 
}

function openMediaPreview2025(type) { 
  triggerHaptic(); 
  if (!currentActiveMedia || !currentActiveMedia[type]) { 
    showToast('ไม่มีรูปปีก่อน', 'error'); 
    return; 
  } 
  document.getElementById('previewImageSrc').src = getDriveDirectLink(currentActiveMedia[type]); 
  imagePreviewModalInstance.show(); 
}

document.getElementById('imagePreviewModal').addEventListener('hidden.bs.modal', function () { 
  document.getElementById('previewImageSrc').src = ''; 
});

function previewTrackImageById(imgId) {
  triggerHaptic();
  const el = document.getElementById(imgId);
  if (!el || !el.src) return;
  document.getElementById('previewImageSrc').src = el.src;
  imagePreviewModalInstance.show();
}

function onAdminMediaRaceChange() {
  const raceId = document.getElementById('adMediaRace').value; 
  const currentRace = globalRaces.find(function(r) { return r.id === raceId; });
  if (currentRace && currentRace.media) { 
    document.getElementById('adTrackImgUrl').value = currentRace.media.trackImg || "";
    document.getElementById('adPracticeUrl').value = currentRace.media.practiceImg || ""; 
    document.getElementById('adQuali2025Url').value = currentRace.media.quali2025 || ""; 
    document.getElementById('adRace2025Url').value = currentRace.media.race2025 || ""; 
    document.getElementById('adExtLink').value = currentRace.media.extLink || ""; 
  } else { 
    document.getElementById('adTrackImgUrl').value = "";
    document.getElementById('adPracticeUrl').value = ""; 
    document.getElementById('adQuali2025Url').value = ""; 
    document.getElementById('adRace2025Url').value = ""; 
    document.getElementById('adExtLink').value = ""; 
  }
}

function onAdminRaceChange() {
  const rSel = document.getElementById('adminRace');
  const opt = rSel.options[rSel.selectedIndex];
  if (!opt || !opt.value) return;
  const isSprint = opt.dataset.type === 'Sprint';
  const flWrap = document.getElementById('adminFlWrapper');
  if (flWrap) flWrap.style.display = isSprint ? 'none' : 'block';
}

function switchToRegisterFromLogin() { loginGateModalInstance.hide(); regModalInstance.show(); }

function confirmLoginGate() { 
  triggerHaptic(); 
  const selected = document.getElementById('loginPlayerSelect').value; 
  const pinEl = document.getElementById('loginPin');
  const pin = pinEl ? pinEl.value : "";

  if (!selected) { showToast('กรุณาเลือกชื่อก่อน', 'error'); return; } 
  if (pinEl && (!pin || pin.length !== 4)) { showToast('กรุณากรอก PIN 4 หลัก', 'error'); return; }

  const btn = document.querySelector('#loginGateModal .btn-race');
  const oldText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>ตรวจสอบ...';

  callGAS("loginPlayer", { playerName: selected, pin: pin }).then(function(res) {
    btn.disabled = false; btn.innerHTML = oldText;
    if (res.success) {
      localStorage.setItem('f1_player_name', selected); 
      if (pinEl) pinEl.value = '';
      updateUserSessionUI(); 
      loginGateModalInstance.hide(); 
      onRaceChange(); 
      showToast('เข้าสู่ระบบสำเร็จ!', 'success'); 
    } else {
      showToast(res.msg, 'error');
    }
  }).catch(function(err) {
    btn.disabled = false; btn.innerHTML = oldText;
    showToast('Error: ' + err, 'error');
  });
}

function showTab(tabId, el) { 
  triggerHaptic(); 
  document.querySelectorAll('.tab-pane-custom').forEach(function(p) { p.style.display = 'none'; }); 
  document.querySelectorAll('.f1-nav-link').forEach(function(l) { l.classList.remove('active'); }); 
  document.getElementById(tabId).style.display = 'block'; 
  el.classList.add('active'); 
}

function forceRefreshData() { 
  if (isRefreshing) return;
  isRefreshing = true;
  triggerHaptic();
  document.getElementById('globalLoader').classList.remove('hidden'); 
  loadData(true); 
}

function renderUI(data) {
  globalLeaderboard = data.leaderboard || []; 
  globalPlayers = data.players || []; 
  globalRaces = data.races || [];

  const pGate = document.getElementById('loginPlayerSelect');
  if(pGate) pGate.innerHTML = '<option value="" disabled selected>-- เลือกชื่อ --</option>' + globalPlayers.map(function(p) { return '<option value="' + p + '">' + p + '</option>'; }).join('');

  const savedPlayer = localStorage.getItem('f1_player_name');
  if (!savedPlayer || !globalPlayers.includes(savedPlayer)) { 
    const loginEl = document.getElementById('loginGateModal');
    if(loginGateModalInstance && loginEl && !loginEl.classList.contains('show')) loginGateModalInstance.show(); 
  } else { 
    if(pGate) pGate.value = savedPlayer; 
  }
  updateUserSessionUI();

  const openRaces = globalRaces.filter(function(r) { return r.status === 'OPEN'; });
  const selRace = document.getElementById('selRace');
  if(selRace) selRace.innerHTML = '<option value="" disabled selected>-- เลือกสนาม --</option>' + openRaces.map(function(r) { return '<option value="' + r.id + '" data-type="' + r.type + '" data-dl="' + r.deadline + '">🟢 ' + r.name + '</option>'; }).join('');

  const allRaceOpts = '<option value="" disabled selected>-- เลือกสนาม --</option>' + globalRaces.map(function(r) { return '<option value="' + r.id + '" data-type="' + r.type + '">' + (r.status === 'OPEN' ? '🟢' : (r.status === 'CALCULATED' ? '🏁' : '🟡')) + ' ' + r.name + '</option>'; }).join('');
  ['selCommRace','adminRace','adRaceDead','adRaceCheck','adMediaRace','selCenterRace','sel2025Race'].forEach(function(id) { let el = document.getElementById(id); if(el) el.innerHTML = allRaceOpts; });

  if (globalRaces.length > 0) { document.getElementById('adMediaRace').value = globalRaces[0].id; onAdminMediaRaceChange(); }
  if (openRaces.length > 0) { document.getElementById('selCenterRace').value = openRaces[0].id; document.getElementById('sel2025Race').value = openRaces[0].id; onCenterRaceChange(); on2025RaceChange(); }

  // --- ส่วนสร้างตารางคะแนน (Leaderboard) ---
  const lbContainer = document.getElementById('lbListContainer'); 
  const podiumContainer = document.getElementById('podiumContainer');

  // ✅ แก้ไขเงื่อนไข if / else ให้ถูกต้อง
  if (!globalLeaderboard || globalLeaderboard.length === 0) {
    if (podiumContainer) podiumContainer.innerHTML = ''; 
    if (lbContainer) lbContainer.innerHTML = '<div class="text-center text-muted py-3">ยังไม่มีคะแนนสะสม</div>';
  } else {
    let podiumHtml = '<div class="premium-podium-container">'; 
    const top1 = globalLeaderboard[0];
    const top2 = globalLeaderboard[1];
    const top3 = globalLeaderboard[2];
    const rest = globalLeaderboard.slice(3);

    // --- 🥇 การ์ดอันดับ 1 (King Card) ---
    if (top1) {
      const team = top1[4] || "F1";
      const teamColor = TEAM_COLORS[team] || "#555555";
      const logoUrl = TEAM_LOGOS[team] || ""; 
      const carUrl = TEAM_CARS[team] || "";
      const teamIcon = logoUrl ? '<img src="' + getDriveDirectLink(logoUrl) + '" class="team-logo-small" alt="">' : '';
      const carImg = carUrl ? '<img src="' + getDriveDirectLink(carUrl) + '" alt="">' : '';

      podiumHtml += '<div class="premium-card king" style="--team-color: ' + teamColor + '; --border-color: #ffb703;" onclick="showPlayerStats(decodeURIComponent(\'' + encodeURIComponent(String(top1[1])) + '\'))">' +
                      '<div class="bg-glow"></div>' +
                      '<img src="' + getDriveDirectLink(logoUrl) + '" class="watermark-logo" alt="">' +
                      '<div class="card-header">' +
                        '<div class="rank-badge rank-1"><i class="fa-solid fa-crown me-1"></i>1</div>' +
                        '<div class="pts-display">' + top1[2] + ' <span class="pts-label">PTS</span></div>' +
                      '</div>' +
                      '<div class="car-showcase">' + carImg + '</div>' +
                      '<div class="card-footer">' +
                        '<div class="player-name">' + top1[1] + '</div>' +
                        teamIcon +
                      '</div>' +
                    '</div>';
    }

    // --- 🥈🥉 การ์ดอันดับ 2 และ 3 (Prince Cards) ---
    if (top2 || top3) {
      podiumHtml += '<div class="princes-row">';
      [top2, top3].forEach(function(p, idx) {
        if(!p) return;
        const rank = idx + 2; 
        const team = p[4] || "F1";
        const teamColor = TEAM_COLORS[team] || "#555555";
        const logoUrl = TEAM_LOGOS[team] || ""; 
        const carUrl = TEAM_CARS[team] || "";
        const teamIcon = logoUrl ? '<img src="' + getDriveDirectLink(logoUrl) + '" class="team-logo-small" alt="">' : '';
        const carImg = carUrl ? '<img src="' + getDriveDirectLink(carUrl) + '" alt="">' : '';
        const borderColor = rank === 2 ? '#cbd5e1' : '#d97706';

        podiumHtml += '<div class="premium-card prince" style="--team-color: ' + teamColor + '; --border-color: ' + borderColor + ';" onclick="showPlayerStats(decodeURIComponent(\'' + encodeURIComponent(String(p[1])) + '\'))">' +
                        '<div class="bg-glow"></div>' +
                        '<img src="' + getDriveDirectLink(logoUrl) + '" class="watermark-logo" alt="">' +
                        '<div class="card-header">' +
                          '<div class="rank-badge rank-' + rank + '">' + rank + '</div>' +
                          '<div class="pts-display">' + p[2] + ' <span class="pts-label">PTS</span></div>' +
                        '</div>' +
                        '<div class="car-showcase">' + carImg + '</div>' +
                        '<div class="card-footer">' +
                          '<div class="player-name">' + p[1] + '</div>' +
                          teamIcon +
                        '</div>' +
                      '</div>';
      });
      podiumHtml += '</div>';
    }

    podiumHtml += '</div>';

    if(podiumContainer) podiumContainer.innerHTML = podiumHtml;

    // ส่วนประกอบร่างการ์ดรูปรถ (อันดับ 4 เป็นต้นไป)
    if(lbContainer) {
      lbContainer.innerHTML = rest.map(function(row) {
        const rank = row[0];
        const name = row[1];
        const totalPts = row[2];
        const lastPts = Number(row[3]) || 0;
        const team = row[4] || "F1";

        const teamColor = TEAM_COLORS[team] || "#555555";
        const logoUrl = TEAM_LOGOS[team] || "";
        const carUrl = TEAM_CARS[team] || "";

        const gainBadge = lastPts > 0 ? '<div class="pts-gain-badge">+' + lastPts + '</div>' : '';

        return '<div class="player-list-card" style="--team-color: ' + teamColor + ';" onclick="showPlayerStats(decodeURIComponent(\'' + encodeURIComponent(String(name)) + '\'))">' +
                 '<img src="' + getDriveDirectLink(logoUrl) + '" class="player-list-watermark" alt="">' +
                 (carUrl ? '<img src="' + getDriveDirectLink(carUrl) + '" class="player-list-car-img" alt="Car">' : '') +
                 '<div class="player-list-content">' +
                   '<div class="player-list-left">' +
                     '<div class="player-list-rank">' + rank + '</div>' +
                     '<div class="player-list-name">' + name + '</div>' +
                   '</div>' +
                   '<div class="player-list-right">' +
                     gainBadge +
                     '<div class="player-list-total">' + totalPts + ' <span class="pts-lbl">PTS</span></div>' +
                   '</div>' +
                 '</div>' +
               '</div>';
      }).join('');
    }
  }

  const calcRaces = globalRaces.filter(function(r) { return r.status === 'CALCULATED'; }); 
  const finishedSelect = document.getElementById('selFinishedRace');
  if(finishedSelect) {
    if (calcRaces.length === 0) { 
      finishedSelect.innerHTML = '<option value="" disabled selected>-- ยังไม่มีสนามที่สรุปผล --</option>'; 
      finishedSelect.disabled = true; 
    } else { 
      finishedSelect.disabled = false; 
      finishedSelect.innerHTML = '<option value="" disabled selected>-- เลือกสนาม --</option>' + calcRaces.map(function(r) { return '<option value="' + r.id + '">🏁 ' + r.name + '</option>'; }).join(''); 
    }
  }
}

function loadData(ignoreCache = false) {
  if (!ignoreCache) {
    const cachedStr = localStorage.getItem('f1_cached_data');
    if (cachedStr) {
      try {
        const cachedData = JSON.parse(cachedStr);
        renderUI(cachedData);
        document.getElementById('globalLoader').classList.add('hidden');
      } catch(e) {}
    } else {
      document.getElementById('globalLoader').classList.remove('hidden');
    }
  }

  callGAS("getInitData").then(function(data) {
    isRefreshing = false; 
    if(!data) return;
    localStorage.setItem('f1_cached_data', JSON.stringify(data));
    renderUI(data);
    document.getElementById('globalLoader').classList.add('hidden');
  }).catch(function(err) { 
    isRefreshing = false; 
    showToast('Error: ' + err, 'error'); 
    document.getElementById('globalLoader').classList.add('hidden'); 
  });
}

function handleCheckFinishedRace() { 
  triggerHaptic(); 
  const raceId = document.getElementById('selFinishedRace').value; 
  if (!raceId) { showToast('กรุณาเลือกสนามก่อน', 'error'); return; } 
  openBreakdownModal(raceId); 
}

function updateUserSessionUI() {
  const player = localStorage.getItem('f1_player_name');
  const formDisplay = document.getElementById('formPlayerDisplay');

  if (!player) { 
    document.getElementById('myPlayerName').innerText = '--'; 
    document.getElementById('myCurrentRank').innerText = '-'; 
    document.getElementById('myTotalScore').innerText = '0'; 
    if (formDisplay) formDisplay.innerText = '-';
    return; 
  }

  document.getElementById('myPlayerName').innerText = player; 
  if (formDisplay) formDisplay.innerText = player;

  const match = globalLeaderboard.find(function(row) { return String(row[1]).toLowerCase() === player.toLowerCase(); });
  if (match) { 
    document.getElementById('myCurrentRank').innerText = 'อันดับที่ ' + match[0]; 
    document.getElementById('myTotalScore').innerText = match[2]; 
  } else { 
    document.getElementById('myCurrentRank').innerText = 'ยังไม่มีอันดับ'; 
    document.getElementById('myTotalScore').innerText = '0'; 
  }
}

function onRaceChange() {
  const rSel = document.getElementById('selRace'); 
  const opt = rSel.options[rSel.selectedIndex]; 
  if (!opt || !opt.value) return;
  const raceId = opt.value; 
  const isSprint = opt.dataset.type === 'Sprint'; 
  document.getElementById('flWrapper').style.display = isSprint ? 'none' : 'block';
  let rawDl = (opt.dataset.dl || "").trim(); 
  if (!rawDl) { currentDeadline = null; } else { currentDeadline = new Date(rawDl.replace(' ', 'T')); }
  startCountdown();

  const raceObj = globalRaces.find(function(r) { return r.id === raceId; });
  const imgWrapper = document.getElementById('trackImageWrapper');
  const imgEl = document.getElementById('trackImagePreview');
  if (imgWrapper && imgEl) {
    if (raceObj && raceObj.media && raceObj.media.trackImg) {
      imgEl.src = getDriveDirectLink(raceObj.media.trackImg);
      imgWrapper.style.display = 'block';
    } else {
      imgEl.src = '';
      imgWrapper.style.display = 'none';
    }
  }

  ['pos1','pos2','pos3','pos4','posFL'].forEach(function(id) { 
    const el = document.getElementById(id);
    if (el) el.value = ''; 
    updateCardUI(id, ''); 
  });

  const player = localStorage.getItem('f1_player_name'); 
  const histAlert = document.getElementById('savedPredAlert');
  if (player) {
    callGAS("getUserSavedPrediction", { raceId: raceId, playerName: player }).then(function(res) {
      if (res.found) {
        histAlert.style.display = 'block'; 
        document.getElementById('savedPredTime').innerText = 'บันทึกเมื่อ: ' + res.submittedAt; 
        document.getElementById('savedPredContent').innerHTML = '<strong>P1:</strong> ' + res.p1 + ' | <strong>P2:</strong> ' + res.p2 + '<br><strong>P3:</strong> ' + res.p3 + ' | <strong>P4:</strong> ' + res.p4 + (res.fl ? ' | <strong>FL:</strong> ' + res.fl : '');

        const savedVals = [res.p1, res.p2, res.p3, res.p4, res.fl];
        ['pos1','pos2','pos3','pos4','posFL'].forEach(function(id, i) { 
          const val = savedVals[i] || '';
          const el = document.getElementById(id);
          if (el) el.value = val; 
          updateCardUI(id, val);
        });
      } else { histAlert.style.display = 'none'; }
    });
  } else { histAlert.style.display = 'none'; }
}

// ฟังก์ชันแปลงข้อความยาง (เช่น "C2 / C3 / C4") ให้เป็นวงกลมสีขอบยาง Pirelli (Hard ขาว / Medium เหลือง / Soft แดง)
function formatPirelliTires(tireStr) {
  if (!tireStr || tireStr.trim() === '-' || tireStr.trim() === '') return '-';
  
  // ค้นหาตัวเลขเบอร์ยาง เช่น C1, C2, C3, C4, C5, C6
  const matches = tireStr.toUpperCase().match(/C\d/g);
  if (!matches || matches.length === 0) {
    return tireStr; // ถ้าไม่ได้พิมพ์ในรูปแบบ C1-C6 ให้แสดงข้อความตามปกติ
  }

  // เรียงลำดับจากเลขน้อยไปมาก (เลขน้อย = แข็ง Hard, เลขกลาง = Medium, เลขมาก = นิ่ม Soft)
  const sorted = matches.slice().sort(function(a, b) {
    return parseInt(a.replace('C', '')) - parseInt(b.replace('C', ''));
  });

  let html = '<div class="pirelli-compounds-wrap">';
  sorted.forEach(function(comp, idx) {
    let colorClass = 'tyre-medium';
    let labelTitle = 'Medium';
    if (sorted.length === 3) {
      if (idx === 0) { colorClass = 'tyre-hard'; labelTitle = 'Hard'; }
      else if (idx === 1) { colorClass = 'tyre-medium'; labelTitle = 'Medium'; }
      else if (idx === 2) { colorClass = 'tyre-soft'; labelTitle = 'Soft'; }
    } else if (idx === 0) {
      colorClass = 'tyre-hard';
    } else if (idx === sorted.length - 1) {
      colorClass = 'tyre-soft';
    }
    html += '<span class="tyre-compound-pill ' + colorClass + '" title="' + labelTitle + '">' + comp + '</span>';
  });
  html += '</div>';
  return html;
}

function onCenterRaceChange() {
  const raceId = document.getElementById('selCenterRace').value; 
  const currentRace = globalRaces.find(function(r) { return r.id === raceId; }); 
  const container = document.getElementById('rcContent');
  if (!currentRace) { container.style.display = 'none'; return; }
  container.style.display = 'block'; 
  currentActiveMedia = currentRace.media || null; 
  const m = currentActiveMedia || {};

  // 1. ควบคุมการแสดงผล "ผลการฝึกซ้อมรวม" (แสดงภาพทันที / ซ่อนถ้าไม่มีลิงก์)
  const practiceWrapper = document.getElementById('practiceSectionWrapper');
  const thumbPrac = document.getElementById('thumbPractice');
  
  if (practiceWrapper && thumbPrac) {
    if (m.practiceImg && m.practiceImg.trim() !== "") {
      thumbPrac.src = getDriveDirectLink(m.practiceImg);
      practiceWrapper.style.display = 'block';
    } else {
      thumbPrac.src = '';
      practiceWrapper.style.display = 'none';
    }
  }
  
  // 2. ปุ่มดูอัตราต่อรอง
  const oddsBtn = document.getElementById('rcExtLinkBtn');
  if (oddsBtn) { 
    if (m.extLink && m.extLink.trim() !== "") { 
      oddsBtn.href = m.extLink; 
      oddsBtn.onclick = null; 
    } else { 
      oddsBtn.href = "javascript:void(0)"; 
      oddsBtn.onclick = function() { showToast("ไม่มีลิงก์", "error"); }; 
    } 
  }
  
  // 3. ข้อมูล Telemetry Spec Sheet (พร้อมแปลงยาง Pirelli เป็นวงกลมสี)
  const info = currentRace.trackInfo || {};
  document.getElementById('rcTrackType').innerText = info.trackType || '-'; 
  document.getElementById('rcTires').innerHTML = formatPirelliTires(info.tires || '-'); 
  document.getElementById('rcSafetyCar').innerText = info.safetyCar || '-'; 
  document.getElementById('rcWeather').innerHTML = '<span class="weather-icon-animated">' + (info.weather || '-') + '</span>'; 
  document.getElementById('rcPrevWinners').innerText = info.prevWinners || '-'; 
  document.getElementById('rcKeyNote').innerText = info.keyNote || '-';

  // 4. ควบคุมการแสดงผล "รูปแผนผังแทร็ก" ด้านบนการ์ด
  const layoutWrapper = document.getElementById('rcTrackLayoutWrapper');
  const layoutImg = document.getElementById('rcTrackLayoutImg');
  if (layoutWrapper && layoutImg) {
    if (m.trackLayoutImg && m.trackLayoutImg.trim() !== "") {
      layoutImg.src = getDriveDirectLink(m.trackLayoutImg);
      layoutWrapper.style.display = 'block';
    } else {
      layoutImg.src = '';
      layoutWrapper.style.display = 'none';
    }
  }
}

function on2025RaceChange() {
  const raceId = document.getElementById('sel2025Race').value; 
  const currentRace = globalRaces.find(function(r) { return r.id === raceId; }); 
  const container = document.getElementById('content2025');
  if (!currentRace) { container.style.display = 'none'; return; }
  container.style.display = 'block'; 
  currentActiveMedia = currentRace.media || null; 
  const m = currentActiveMedia || {};

  function updateCard2025(badgeId, thumbId, imgUrl) { 
    const el = document.getElementById(badgeId); 
    const thumb = document.getElementById(thumbId);
    const hasImg = !!imgUrl;

    if (el) { 
      el.className = hasImg ? 'rc-btn-badge bg-success text-white' : 'rc-btn-badge bg-secondary text-white'; 
      el.innerText = hasImg ? '🔍 แตะเพื่อขยาย' : 'ไม่มีภาพ'; 
    }
    if (thumb) {
      if (hasImg) {
        thumb.src = getDriveDirectLink(imgUrl);
        thumb.style.display = 'block';
      } else {
        thumb.src = '';
        thumb.style.display = 'none';
      }
    }
  }

  updateCard2025('badgeQuali2025', 'thumbQuali2025', m.quali2025); 
  updateCard2025('badgeRace2025', 'thumbRace2025', m.race2025);
}

function startCountdown() {
  clearInterval(countdownInterval); 
  const box = document.getElementById('countdownBox'); 
  const submitBtn = document.getElementById('btnPred');
  if (!currentDeadline || isNaN(currentDeadline.getTime())) { 
    box.style.display = 'block'; 
    box.innerHTML = '<div class="text-secondary small py-1"><i class="fa-solid fa-clock me-1"></i>ยังไม่ได้กำหนดเวลาปิดรับ</div>'; 
    return; 
  }
  box.style.display = 'block';
  function updateTimer() {
    const diff = currentDeadline - new Date();
    if (diff <= 0) { 
      box.innerHTML = '<div class="text-danger fw-bold py-1">⏰ หมดเวลาทายผล</div>'; 
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'CLOSED'; } 
      clearInterval(countdownInterval); 
      return; 
    }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>SUBMIT PREDICTION'; }
    const d = Math.floor(diff / 86400000); 
    const h = Math.floor((diff / 3600000) % 24); 
    const m = Math.floor((diff / 60000) % 60); 
    const s = Math.floor((diff / 1000) % 60);
    const pad = function(n) { return String(n).padStart(2, '0'); };
    box.innerHTML = '<div class="timer-units"><div><div class="timer-num">' + pad(d) + '</div><div class="timer-lbl">DAY</div></div><div><div class="timer-num">' + pad(h) + '</div><div class="timer-lbl">HRS</div></div><div><div class="timer-num">' + pad(m) + '</div><div class="timer-lbl">MIN</div></div><div><div class="timer-num">' + pad(s) + '</div><div class="timer-lbl">SEC</div></div></div>';
  }
  updateTimer(); 
  countdownInterval = setInterval(updateTimer, 1000);
}

function openBreakdownModal(raceId) {
  triggerHaptic(); 
  breakdownModalInstance.show(); 
  const body = document.getElementById('breakdownBody'); 
  body.innerHTML = '<div class="text-center py-3"><i class="fa-solid fa-spinner fa-spin me-2"></i>กำลังตรวจสอบผล...</div>';
  callGAS("getRaceBreakdown", { raceId: raceId, playerName: localStorage.getItem('f1_player_name') || '' }).then(function(res) {
    if (!res.actual) { body.innerHTML = '<div class="text-danger text-center">ไม่พบข้อมูล</div>'; return; }
    const act = res.actual, pred = res.userPred;
    function matchRow(posName, actVal, predVal) {
      const isMatch = predVal && actVal && (predVal.trim().toLowerCase() === actVal.trim().toLowerCase());
      const badge = pred ? (isMatch ? '<span class="badge bg-success">✅ +2</span>' : '<span class="badge bg-danger">❌ 0</span>') : '';
      return '<div class="p-2 mb-2 rounded bg-black border ' + (isMatch ? 'border-success' : 'border-secondary') + '"><div class="d-flex justify-content-between small text-secondary mb-1"><span><strong>' + posName + '</strong> (จริง: <span class="text-warning">' + (actVal || '-') + '</span>)</span>' + badge + '</div><div class="small text-white">คุณทาย: <strong>' + (predVal || '<span class="text-muted">ไม่ได้ส่ง</span>') + '</strong></div></div>';
    }
    let html = '<div class="mb-3 text-center"><h6 class="fw-bold text-white mb-1">' + act.name + '</h6>' + (pred ? '<span class="badge bg-warning text-dark fs-6">คะแนน: ' + pred.score + ' แต้ม</span>' : '<span class="badge bg-secondary">ไม่ได้ส่งคำทาย</span>') + '</div>' + matchRow('P1', act.p1, pred?pred.p1:'') + matchRow('P2', act.p2, pred?pred.p2:'') + matchRow('P3', act.p3, pred?pred.p3:'') + matchRow('P4', act.p4, pred?pred.p4:'');
    if (act.type !== 'Sprint') {
      const mFL = pred && pred.fl && act.fl && pred.fl.trim().toLowerCase() === act.fl.trim().toLowerCase();
      const badgeFl = pred ? (mFL ? '<span class="badge bg-success">✅ +1</span>' : '<span class="badge bg-danger">❌ 0</span>') : '';
      html += '<div class="p-2 mb-2 rounded bg-black border ' + (mFL ? 'border-success' : 'border-secondary') + '"><div class="d-flex justify-content-between small text-secondary mb-1"><span><strong>⚡ FL</strong> (จริง: <span class="text-warning">' + (act.fl || '-') + '</span>)</span>' + badgeFl + '</div><div class="small text-white">คุณทาย: <strong>' + (pred?pred.fl:'<span class="text-muted">ไม่ได้ส่ง</span>') + '</strong></div></div>';
    }
    body.innerHTML = html;
  });
}

function loadCommunityPredictions() {
  const raceId = document.getElementById('selCommRace').value; 
  const box = document.getElementById('commContent'); 
  box.innerHTML = '<div class="text-center text-secondary py-3"><i class="fa-solid fa-spinner fa-spin me-2"></i>กำลังตรวจสอบข้อมูล...</div>';
  callGAS("getCommunityPredictions", { raceId: raceId }).then(function(res) {
    if (!res.locked) { box.innerHTML = '<div class="p-3 rounded text-center bg-black border border-warning"><div class="text-warning fw-bold fs-5 mb-2"><i class="fa-solid fa-lock me-2"></i>ยังไม่เปิดเผยข้อมูล</div><div class="small text-secondary">' + res.msg + '</div></div>'; return; }
    if (res.predictions.length === 0) { box.innerHTML = '<div class="text-center text-muted py-3">ไม่มีใครส่งคำทายในสนามนี้</div>'; return; }
    let html = '<div class="consensus-stat-card"><div class="small text-secondary fw-bold mb-2 text-uppercase"><i class="fa-solid fa-chart-pie text-info me-1"></i>สถิติเสียงส่วนใหญ่ (' + res.totalPredictors + ' คน)</div><div class="d-flex justify-content-between small py-1 border-bottom border-dark"><span>🏆 เต็ง 1 (P1):</span><span class="text-warning fw-bold">' + res.topP1 + '</span></div><div class="d-flex justify-content-between small py-1"><span>⚡ เต็ง FL:</span><span class="text-info fw-bold">' + res.topFL + '</span></div></div>';
    html += res.predictions.map(function(p) { return '<div class="p-3 mb-2 rounded bg-black border border-secondary text-start"><div class="d-flex justify-content-between align-items-center mb-2"><span class="fw-bold text-white"><i class="fa-solid fa-user-astronaut text-danger me-2"></i>' + p.player + '</span><span class="badge bg-danger">ได้ ' + p.score + ' แต้ม</span></div><div class="small text-secondary"><div><strong>P1:</strong> ' + p.p1 + ' | <strong>P2:</strong> ' + p.p2 + '</div><div><strong>P3:</strong> ' + p.p3 + ' | <strong>P4:</strong> ' + p.p4 + '</div>' + (p.fl ? '<div class="text-purple"><strong>⚡ FL:</strong> ' + p.fl + '</div>' : '') + '</div></div>'; }).join('');
    box.innerHTML = html;
  });
}

function showPlayerStats(playerName) {
  triggerHaptic(); 
  statsModalInstance.show(); 
  document.getElementById('statsBody').innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>กำลังคำนวณสถิติ...';
  callGAS("getPlayerStats", { playerName: playerName }).then(function(res) {
    document.getElementById('statsBody').innerHTML = '<div class="mb-3"><div class="fs-4 fw-bold text-white mb-1"><i class="fa-solid fa-user-astronaut text-danger me-2"></i>' + res.playerName + '</div><span class="badge bg-warning text-dark fs-6">อันดับที่ ' + res.rank + '</span> <span class="badge bg-danger fs-6">' + res.totalScore + ' คะแนน</span></div><div class="row g-2 mb-3"><div class="col-6"><div class="p-2 rounded bg-black border border-secondary"><div class="text-secondary small">ทายเป๊ะ (P1-P4)</div><div class="fs-4 fw-bold text-info">' + res.exactHits + ' ครั้ง</div></div></div><div class="col-6"><div class="p-2 rounded bg-black border border-secondary"><div class="text-secondary small">ทาย FL ถูก</div><div class="fs-4 fw-bold text-purple">' + res.flHits + ' ครั้ง</div></div></div></div><h6 class="text-secondary small fw-bold text-start text-uppercase mb-2">ประวัติคะแนนแต่ละสนาม</h6><div class="p-2 rounded bg-black border border-secondary" style="max-height: 180px; overflow-y: auto;">' + (res.history.length === 0 ? '<div class="text-muted small">ยังไม่มีประวัติ</div>' : res.history.map(function(h) { return '<div class="d-flex justify-content-between small py-1 border-bottom border-dark text-start"><span>' + h.race + '</span><span class="text-warning fw-bold">' + h.score + ' pts</span></div>'; }).join('')) + '</div>';
  });
}

function handleAdminDeadline() { 
  const pin = document.getElementById('adminPin').value, raceId = document.getElementById('adRaceDead').value, rawDt = document.getElementById('adNewDead').value; 
  if (!pin || !raceId) { showToast('กรุณากรอก Admin PIN', 'error'); return; } 
  callGAS("adminUpdateRaceSettings", { pin: pin, raceId: raceId, newDeadline: rawDt?rawDt.replace('T', ' '):'', newStatus: document.getElementById('adNewStatus').value }).then(function(res) { 
    showToast(res.msg, res.success ? 'success' : 'error'); if(res.success) forceRefreshData(); 
  }); 
}

function handleAdminSetupNewSeason() { 
  const pin = document.getElementById('adminPin').value, year = document.getElementById('adSeasonYear').value; 
  if (!pin || !year) return; 
  if (!confirm('ยืนยันการดึงตารางแข่ง?')) return; 
  showToast('กำลังดึงข้อมูลปฏิทิน...', 'success'); 
  callGAS("adminSetupNewSeasonCalendar", { pin: pin, seasonYear: year }).then(function(res) { 
    showToast(res.msg, res.success ? 'success' : 'error'); if(res.success) forceRefreshData(); 
  }); 
}

function handleAdminSaveMediaLinks() { 
  const pin = document.getElementById('adminPin').value, raceId = document.getElementById('adMediaRace').value; 
  if (!pin || !raceId) { showToast('กรุณากรอก Admin PIN', 'error'); return; } 
  const payload = { 
    raceId: raceId, 
    trackImg: document.getElementById('adTrackImgUrl').value.trim(),
    practiceImg: document.getElementById('adPracticeUrl').value.trim(), 
    quali2025: document.getElementById('adQuali2025Url').value.trim(), 
    race2025: document.getElementById('adRace2025Url').value.trim(), 
    extLink: document.getElementById('adExtLink').value.trim(), 
    extTitle: "อัตราต่อรอง" 
  }; 
  callGAS("adminSaveTrackMediaLinks", { pin: pin, data: payload }).then(function(res) { 
    showToast(res.msg, res.success ? 'success' : 'error'); 
    if(res.success) forceRefreshData(); 
  }); 
}

function matchDriverOption(selectId, apiName) { 
  if (!apiName) return; 
  const select = document.getElementById(selectId); 
  const cleanApi = apiName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); 
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === cleanApi) { 
      select.selectedIndex = i; return; 
    } 
  }
  const lastName = cleanApi.split(" ").pop(); 
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().includes(lastName)) { 
      select.selectedIndex = i; return; 
    } 
  }
}

function handleFetchOfficialResults() { 
  const pin = document.getElementById('adminPin').value, raceId = document.getElementById('adminRace').value, btn = document.getElementById('btnApiFetch'); 
  if (!pin || !raceId) return; 
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; 
  callGAS("adminFetchOfficialResults", { pin: pin, raceId: raceId }).then(function(res) { 
    btn.disabled = false; btn.innerHTML = 'ดึงผลจริง API'; 
    if (!res.success) { showToast("⚠️ " + res.msg, 'error'); return; } 
    matchDriverOption('adP1', res.data.p1); matchDriverOption('adP2', res.data.p2); matchDriverOption('adP3', res.data.p3); matchDriverOption('adP4', res.data.p4); 
    if (res.data.type !== 'Sprint' && res.data.fl) matchDriverOption('adFL', res.data.fl); 
    if (res.data.url) document.getElementById('adLink').value = res.data.url; 
    showToast(res.msg, 'success'); 
  }); 
}

function checkAdminSubmissions() { 
  const pin = document.getElementById('adminPin').value, raceId = document.getElementById('adRaceCheck').value; 
  if (!pin || !raceId) return; 
  document.getElementById('subStatusContainer').style.display = 'block'; 
  document.getElementById('subStatusSummary').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; 
  callGAS("adminGetSubmissionStatus", { pin: pin, raceId: raceId }).then(function(res) { 
    if (!res.success) { showToast(res.msg, 'error'); document.getElementById('subStatusContainer').style.display = 'none'; return; } 
    lastPendingList = res.pending || []; 
    document.getElementById('subStatusSummary').innerHTML = 'รวม: <strong>' + res.total + '</strong> | ส่งแล้ว: <strong class="text-success">' + res.submittedCount + '</strong> | ค้าง: <strong class="text-danger">' + res.pendingCount + '</strong>'; 
    document.getElementById('cntPending').innerText = res.pendingCount; 
    document.getElementById('cntSubmitted').innerText = res.submittedCount; 
    document.getElementById('listPending').innerHTML = res.pending.length ? res.pending.map(function(name) { return '<span class="badge bg-danger text-white me-1 mb-1">' + name + '</span>'; }).join('') : '<span class="text-success small">ส่งครบทุกคนแล้ว!</span>'; 
    document.getElementById('listSubmitted').innerHTML = res.submitted.length ? res.submitted.map(function(s) { return '<div class="d-flex justify-content-between py-1 border-bottom border-secondary"><span class="text-white">✅ ' + s.name + '</span><span class="text-secondary">' + s.time + '</span></div>'; }).join('') : 'ยังไม่มีใครส่ง'; 
  }); 
}

function copyPendingList() { 
  if (!lastPendingList || lastPendingList.length === 0) return; 
  const text = '🏁 ทวงคำทายผล F1\n⚠️ คนที่ยังไม่ได้ส่ง (' + lastPendingList.length + ' คน):\n' + lastPendingList.map(function(n, i) { return (i + 1) + '. ' + n; }).join('\n') + '\n\nรีบส่งก่อนหมดเวลานะครับ!'; 
  navigator.clipboard.writeText(text).then(function() { showToast('คัดลอกเรียบร้อย!', 'success'); }); 
}

function handleRegister(e) { 
  e.preventDefault(); triggerHaptic(); 
  const btn = document.getElementById('btnReg'), 
        name = document.getElementById('regName').value, 
        team = document.getElementById('regTeam').value, 
        pinEl = document.getElementById('regPin'),
        pin = pinEl ? pinEl.value : ""; 
        
  btn.disabled = true; 
  callGAS("registerPlayer", { playerName: name, teamName: team, pin: pin }).then(function(res) { 
    showToast(res.msg, res.success ? 'success' : 'error'); btn.disabled = false; 
    if (res.success) { 
      localStorage.setItem('f1_player_name', name); 
      document.getElementById('regName').value = ''; 
      if (pinEl) pinEl.value = ''; 
      regModalInstance.hide(); 
      forceRefreshData(); 
      showTab('tab-pred', document.querySelectorAll('.f1-nav-link')[1]); 
    } 
  }); 
}

function handlePrediction(e) { 
  e.preventDefault(); triggerHaptic(); 
  const player = localStorage.getItem('f1_player_name'); 
  if (!player) { loginGateModalInstance.show(); return; } 
  
  const rSel = document.getElementById('selRace');
  if (!rSel.value) { showToast('กรุณาเลือกสนามแข่งขันก่อนครับ', 'error'); return; }
  
  const p1 = document.getElementById('pos1').value, 
        p2 = document.getElementById('pos2').value, 
        p3 = document.getElementById('pos3').value, 
        p4 = document.getElementById('pos4').value; 
        
  if (!p1 || !p2 || !p3 || !p4) {
    showToast('กรุณาแตะการ์ดเลือกนักแข่งให้ครบทั้ง P1 - P4 ครับ', 'error');
    return;
  }

  const btn = document.getElementById('btnPred');
  btn.disabled = true; 
  callGAS("submitPrediction", { data: { playerName: player, raceId: rSel.value, type: rSel.options[rSel.selectedIndex].dataset.type, p1: p1, p2: p2, p3: p3, p4: p4, fl: document.getElementById('posFL').value } }).then(function(res) { 
    btn.disabled = false; showToast(res.msg, res.success ? 'success' : 'error'); 
    if (res.success) { 
      document.getElementById('savedPredAlert').style.display = 'block'; 
      document.getElementById('savedPredTime').innerText = 'บันทึกเมื่อ: ' + res.submittedAt; 
      document.getElementById('savedPredContent').innerHTML = '<strong>P1:</strong> ' + res.data.p1 + ' | <strong>P2:</strong> ' + res.data.p2 + '<br><strong>P3:</strong> ' + res.data.p3 + ' | <strong>P4:</strong> ' + res.data.p4 + (res.data.fl ? ' | <strong>FL:</strong> ' + res.data.fl : ''); 
      forceRefreshData(); 
    } 
  }); 
}

function handleAdminSubmit(e) { 
  e.preventDefault(); 
  if (!confirm('ยืนยันบันทึกผลและตัดคะแนน?')) return; 
  const btn = document.getElementById('btnAdmin'), rSel = document.getElementById('adminRace'); 
  btn.disabled = true; 
  callGAS("saveResultAndCalculate", { pin: document.getElementById('adminPin').value, resultData: { raceId: rSel.value, type: rSel.options[rSel.selectedIndex].dataset.type, p1: document.getElementById('adP1').value, p2: document.getElementById('adP2').value, p3: document.getElementById('adP3').value, p4: document.getElementById('adP4').value, fl: document.getElementById('adFL').value, link: document.getElementById('adLink').value } }).then(function(res) { 
    showToast(res.msg, res.success ? 'success' : 'error'); btn.disabled = false; 
    if (res.success) { document.getElementById('adminPin').value = ''; adminModalInstance.hide(); forceRefreshData(); } 
  }); 
}
