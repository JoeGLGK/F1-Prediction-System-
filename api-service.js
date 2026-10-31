// =========================================================
// 2. API SERVICE & CACHING (การเชื่อมต่อฐานข้อมูลและ F1 API)
// =========================================================

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwZ_VB9I7ClOgDpd8bDkaY09CzipETJMeQPDK6Qk6JYVNPdgfXA6ZrmXDG8gYsJ9I6u/exec";

const apiCache = new Map();
const pendingRequests = new Map();

async function callGAS(action, payload = {}, options = { useCache: false, ttl: 30000 }) {
  const cacheKey = action + "_" + JSON.stringify(payload);

  if (options.useCache && apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < options.ttl) {
      return cached.data;
    }
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(GAS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(Object.assign({ action: action }, payload)),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const result = await response.json();

      if (options.useCache) {
        apiCache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
      return result;
    } finally {
      clearTimeout(timeoutId);
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

async function fetchF1Standings() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
    const data = await response.json();
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    
    const container = document.getElementById('driverStandingsList') || document.querySelector('.f1-official-standings');
    if (!container) return;
    const rows = container.querySelectorAll('.f1-standings-row');
    const rowsArray = Array.from(rows);

    standings.forEach(driverData => {
      const apiFamilyName = driverData.Driver.familyName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const points = driverData.points;
      const position = driverData.position;

      const targetRow = rowsArray.find(row => {
        const nameEl = row.querySelector('.driver-name');
        if (!nameEl) return false;
        const htmlName = nameEl.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return htmlName.includes(apiFamilyName);
      });

      if (targetRow) {
        targetRow.querySelector('.col-pts').innerText = points;
        targetRow.querySelector('.col-pos').innerText = position;
        targetRow.setAttribute('data-position', position);
      }
    });

    rowsArray.sort((a, b) => {
      const posA = parseInt(a.getAttribute('data-position')) || 999;
      const posB = parseInt(b.getAttribute('data-position')) || 999;
      return posA - posB;
    });

    rowsArray.forEach(row => row.remove());
    rowsArray.forEach(row => container.appendChild(row));
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลนักแข่ง F1 API:', error);
  }
}

async function fetchF1TeamStandings() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
    const data = await response.json();
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    
    const container = document.getElementById('teamStandingsList') || document.querySelector('.f1-team-cards-container');
    if (!container) return;
    const rowsArray = Array.from(container.querySelectorAll('.team-card'));

    standings.forEach(teamData => {
      const apiTeamId = teamData.Constructor.constructorId.toLowerCase(); 
      const points = teamData.points;
      const position = teamData.position;

      const targetRow = rowsArray.find(row => {
        const nameEl = row.querySelector('.team-name');
        if (!nameEl) return false;
        const htmlName = nameEl.innerText.toLowerCase();
        if (apiTeamId.includes('sauber') && htmlName === 'audi') return true;
        return htmlName.includes(apiTeamId) || apiTeamId.includes(htmlName.split(' ')[0]);
      });

      if (targetRow) {
        targetRow.querySelector('.col-pts').innerText = points;
        targetRow.querySelector('.col-pos').innerText = position;
        targetRow.setAttribute('data-position', position);
      }
    });

    rowsArray.sort((a, b) => {
      const posA = parseInt(a.getAttribute('data-position')) || 999;
      const posB = parseInt(b.getAttribute('data-position')) || 999;
      return posA - posB;
    });

    rowsArray.forEach(row => row.remove());
    rowsArray.forEach(row => container.appendChild(row));
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลคะแนนทีม:', error);
  }
}
async function fetchLiveWeather() {
  try {
    const response = await fetch('https://api.openf1.org/v1/weather?session_key=latest');
    const data = await response.json();

    if (data && data.length > 0) {
      // ดึงข้อมูล array ตัวสุดท้ายซึ่งเป็นข้อมูลอัปเดตล่าสุด
      const latestWeather = data[data.length - 1]; 
      
      // 1. ตรวจจับ rainfall (0 หรือ 1) เพื่อสลับไอคอนฝน/แดด
      const isRaining = latestWeather.rainfall > 0;
      const weatherIcon = isRaining ? '🌧️' : '☀️';

      // 2. จัดรูปแบบ HTML แสดงผลข้อมูล Air, Track, Wind Speed และ Pressure
      // ใช้คลาสของ Bootstrap เพื่อจัดให้อยู่ชิดขวาและแบ่ง 2 บรรทัด
      const weatherHtml = `
        <div class="d-flex flex-column align-items-end">
          <div>
            <span class="weather-icon-animated me-1">${weatherIcon}</span>
            Air: ${latestWeather.air_temperature}°C | Track: ${latestWeather.track_temperature}°C
          </div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">
            <i class="fa-solid fa-wind me-1"></i>ลม: ${latestWeather.wind_speed} m/s | 
            <i class="fa-solid fa-gauge me-1"></i>กดอากาศ: ${latestWeather.pressure} mbar
          </div>
        </div>
      `;

      const weatherEl = document.getElementById('rcWeather');
      if (weatherEl) {
        weatherEl.innerHTML = weatherHtml;
        // เอาคลาส weather-icon-animated ออกจากกล่องหลัก เพราะเราย้ายไปใส่ที่ตัวไอคอนด้านในแล้ว
        weatherEl.classList.remove('weather-icon-animated');
      }
    }
  } catch (error) {
    console.error('❌ OpenF1 Weather API Error:', error);
  }
}
async function loadResultsSessionData(sessionName, btnEl) {
  // สลับสถานะปุ่ม Active
  if (btnEl) {
    document.querySelectorAll('#resultsSessionBtnGroup button').forEach(b => {
      b.classList.remove('active', 'text-white', 'border-white');
    });
    btnEl.classList.add('active', 'text-white', 'border-white');
  }

  const list = document.getElementById('resultsSessionDataList');
  list.innerHTML = '<div class="text-center py-5"><i class="fa-solid fa-spinner fa-spin text-danger fs-3 mb-2"></i><div class="text-secondary small f1-font">FETCHING SESSION RESULTS...</div></div>';
  
  try {
    // ใช้รหัสสนามจาก dropdown เพื่อหา meeting_key
    const rSel = document.getElementById('selResultsRace');
    const raceId = rSel.value; 
    
    // หมายเหตุ: โค้ดส่วนนี้คือโครงสร้างสมมติในการดึง meeting_key หากมีตาราง Map รหัสในระบบ
    // หากทดสอบ ให้ใช้ session_key=latest เพื่อดึงสนามล่าสุดก่อน
    const meetRes = await fetch('https://api.openf1.org/v1/sessions?session_key=latest');
    const meetData = await meetRes.json();
    const meetingKey = meetData[0].meeting_key;
    
    const sesRes = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}&session_name=${encodeURIComponent(sessionName)}`);
    const sesData = await sesRes.json();
    
    if (!sesData || sesData.length === 0) {
      list.innerHTML = `<div class="text-center text-warning py-4"><i class="fa-solid fa-flag-checkered mb-2 fs-3"></i><br>เซสชันนี้ยังไม่เริ่ม หรือไม่มีข้อมูล</div>`;
      return;
    }
    
    const sessionKey = sesData[0].session_key;
    
    // ดึงรายชื่อนักแข่งและข้อมูลอันดับ
    const [driversRes, posRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`)
    ]);
    
    const drivers = await driversRes.json();
    const positions = await posRes.json();
    
    // กรองอันดับสุดท้าย
    const latestPos = {};
    positions.forEach(p => { latestPos[p.driver_number] = p.position; });
    
    const results = drivers.map(d => {
      const pos = latestPos[d.driver_number] || 99;
      // ดึงข้อมูลรูปภาพและสีทีมจาก DRIVER_INFO ในแอปของคุณ
      const appDriver = Object.keys(DRIVER_INFO).find(name => name.includes(d.last_name)) || d.full_name;
      const info = DRIVER_INFO[appDriver] || { team: d.team_name, color: d.team_colour, headshot: DEFAULT_DRIVER_IMG };
      const shortName = d.first_name.charAt(0) + '. ' + d.last_name;
      
      return {
        pos: pos,
        fullName: appDriver,
        shortName: shortName,
        team: info.team || d.team_name,
        color: info.color || `#${d.team_colour}`,
        headshot: getDriveDirectLink(info.headshot || info.img)
      };
    }).sort((a, b) => a.pos - b.pos).filter(r => r.pos !== 99);
    
    if (results.length === 0) {
      list.innerHTML = `<div class="text-center text-secondary py-4">รถยังไม่ออกจากพิต</div>`;
      return;
    }
    
    // สร้างตารางสไตล์ F1 Drivers UI (แสดงหัวคน, ชื่อ, ทีม, ช่องขวาสุดแสดงสถานะ Gap หรือ Interval)
    list.innerHTML = results.map((r, idx) => `
      <div class="f1-standings-row" style="cursor:pointer;" onclick="openDriverHero('${r.fullName}', this)">
        <div class="col-pos" style="width: 15%;">${r.pos}</div>
        <div class="col-driver" style="width: 55%;">
          <img src="${r.headshot}" class="driver-headshot" alt="${r.shortName}" loading="lazy">
          <div class="driver-info">
            <div class="driver-name text-white">${r.shortName}</div>
            <div class="team-name m-0" style="color: ${r.color};">${r.team}</div>
          </div>
        </div>
        <div class="col-pts text-end" style="width: 30%;">
           <span class="text-secondary small fw-bold">${idx === 0 ? 'Leader' : '+Lap Data'}</span>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Session Results Error:', error);
    list.innerHTML = '<div class="text-center text-danger py-4">พบปัญหาในการดึงข้อมูล OpenF1 API</div>';
  }
}
