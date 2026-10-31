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
      const latestWeather = data[data.length - 1]; 
      const isRaining = latestWeather.rainfall > 0;
      const weatherIcon = isRaining ? '🌧️' : '☀️';

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
        weatherEl.classList.remove('weather-icon-animated');
      }
    }
  } catch (error) {
    console.error('❌ OpenF1 Weather API Error:', error);
  }
}

function formatLapTime(seconds) {
  if (!seconds || isNaN(seconds)) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return mins > 0 ? `${mins}:${secs}` : `${secs}s`;
}

async function loadResultsSessionData(sessionKey, btnEl) {
  if (btnEl) {
    document.querySelectorAll('#resultsSessionBtnGroup button').forEach(b => {
      b.classList.remove('active', 'text-white', 'border-white');
    });
    btnEl.classList.add('active', 'text-white', 'border-white');
  }

  const list = document.getElementById('resultsSessionDataList');
  if (!list) return;
  list.innerHTML = '<div class="text-center py-5"><i class="fa-solid fa-spinner fa-spin text-danger fs-3 mb-2"></i><div class="text-secondary small f1-font">FETCHING SESSION RESULTS...</div></div>';
  
  try {
    const [driversRes, posRes, lapsRes, standingsRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`),
      fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
    ]);
    
    const drivers = await driversRes.json();
    const positions = await posRes.json();
    const laps = await lapsRes.json();
    const standingsData = await standingsRes.json();
    
    const seasonStandings = {};
    const standingsLists = standingsData.MRData.StandingsTable.StandingsLists;
    if (standingsLists && standingsLists.length > 0) {
      standingsLists[0].DriverStandings.forEach(ds => {
        const familyName = ds.Driver.familyName.toLowerCase();
        seasonStandings[familyName] = {
          points: ds.points || '0',
          position: 'P' + ds.position
        };
      });
    }

    const latestPos = {};
    positions.forEach(p => { latestPos[p.driver_number] = p.position; });

    const bestLaps = {};
    let sessionFastest = Infinity;

    if (Array.isArray(laps)) {
      laps.forEach(l => {
        const dNum = l.driver_number;
        if (l.lap_duration && l.lap_duration > 0) {
          if (!bestLaps[dNum] || l.lap_duration < bestLaps[dNum]) {
            bestLaps[dNum] = l.lap_duration;
          }
          if (l.lap_duration < sessionFastest) {
            sessionFastest = l.lap_duration;
          }
        }
      });
    }
    
    const results = drivers.map(d => {
      const pos = latestPos[d.driver_number] || 99;
      const lastNameClean = (d.last_name || '').toLowerCase();
      const appDriver = Object.keys(DRIVER_INFO).find(name => name.toLowerCase().includes(lastNameClean)) || d.full_name || 'Driver';
      const info = DRIVER_INFO[appDriver] || { team: d.team_name, color: d.team_colour ? `#${d.team_colour}` : '#888888', headshot: DEFAULT_DRIVER_IMG };
      const firstChar = d.first_name ? d.first_name.charAt(0) + '. ' : '';
      const shortName = firstChar + (d.last_name || d.full_name || '');
      
      const myBest = bestLaps[d.driver_number];
      let timeDisplay = '-';
      if (myBest) {
        if (myBest === sessionFastest) {
          timeDisplay = formatLapTime(myBest);
        } else {
          const diff = (myBest - sessionFastest).toFixed(3);
          timeDisplay = `+${diff}s`;
        }
      } else if (pos === 1) {
        timeDisplay = 'Leader';
      }

      const seasonData = seasonStandings[lastNameClean] || { points: '0', position: 'P-' };

      return {
        pos: pos,
        fullName: appDriver,
        shortName: shortName,
        team: info.team || d.team_name || 'F1',
        color: info.color || (d.team_colour ? `#${d.team_colour}` : '#888888'),
        headshot: getDriveDirectLink(info.headshot || info.img || DEFAULT_DRIVER_IMG),
        timeGap: timeDisplay,
        seasonPoints: seasonData.points,
        seasonPos: seasonData.position
      };
    }).sort((a, b) => a.pos - b.pos).filter(r => r.pos !== 99);
    
    if (results.length === 0) {
      list.innerHTML = `<div class="text-center text-secondary py-4">ไม่มีข้อมูลผลการแข่งขันในเซสชันนี้</div>`;
      return;
    }
    
    list.innerHTML = results.map(r => `
      <div class="f1-standings-row" style="cursor:pointer;" onclick="openDriverHeroCustom(this, '${r.fullName.replace(/'/g, "\\'")}', '${r.seasonPoints}', '${r.seasonPos}')">
        <div class="col-pos" style="width: 12%;">${r.pos}</div>
        <div class="col-driver" style="width: 53%;">
          <img src="${r.headshot}" class="driver-headshot" alt="${r.shortName}" loading="lazy">
          <div class="driver-info">
            <div class="driver-name text-white">${r.shortName}</div>
            <div class="team-name m-0" style="color: ${r.color};">${r.team}</div>
          </div>
        </div>
        <div class="col-pts text-end" style="width: 35%; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem;">
           <span class="text-white fw-bold">${r.timeGap}</span>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Session Results Error:', error);
    list.innerHTML = '<div class="text-center text-danger py-4">พบปัญหาในการดึงข้อมูล OpenF1 API<br><span class="small text-secondary">กรุณาลองใหม่อีกครั้ง</span></div>';
  }
}
