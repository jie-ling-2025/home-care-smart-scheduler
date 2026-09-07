const MONTH = "2026-10";
const STATUS_OPTIONS = ["待送報備", "報備成功", "派車已核准", "家屬已確認", "訪視完成"];
const DATA_LABELS = {
  cases: { title: "當月應訪個案", description: "訪視類型、主責、期限、行政區與需求", required: ["case_id", "alias", "zone", "primary_nurse_id", "doctor_id", "visit_type", "due_start", "due_end", "preferred_period", "needs_vehicle", "duration_min"] },
  doctors: { title: "醫師可訪時段", description: "每一列代表一個可以安排的訪視時段", required: ["doctor_id", "doctor_name", "date", "start_time", "end_time"] },
  nurses: { title: "護理師班表與用車日", description: "主責人員、上班星期與每月可用車日期", required: ["nurse_id", "nurse_name", "work_days", "vehicle_dates", "max_visits"] },
  vehicles: { title: "每日用車容量", description: "各日期最多可安排幾筆需要車輛的訪視", required: ["date", "capacity"] }
};

const defaultData = {
  doctors: [
    { id: "D01", name: "林醫師", slots: [
      { date: "2026-10-06", start: "09:00", end: "10:00" }, { date: "2026-10-06", start: "10:30", end: "11:30" },
      { date: "2026-10-13", start: "09:00", end: "10:00" }, { date: "2026-10-13", start: "10:30", end: "11:30" },
      { date: "2026-10-20", start: "09:00", end: "10:00" }, { date: "2026-10-20", start: "10:30", end: "11:30" }
    ]},
    { id: "D02", name: "陳醫師", slots: [
      { date: "2026-10-08", start: "13:30", end: "14:30" }, { date: "2026-10-08", start: "15:00", end: "16:00" },
      { date: "2026-10-15", start: "13:30", end: "14:30" }, { date: "2026-10-15", start: "15:00", end: "16:00" },
      { date: "2026-10-22", start: "13:30", end: "14:30" }, { date: "2026-10-22", start: "15:00", end: "16:00" }
    ]},
    { id: "D03", name: "吳醫師", slots: [
      { date: "2026-10-09", start: "09:00", end: "10:00" }, { date: "2026-10-09", start: "10:30", end: "11:30" },
      { date: "2026-10-16", start: "09:00", end: "10:00" }, { date: "2026-10-16", start: "10:30", end: "11:30" },
      { date: "2026-10-23", start: "09:00", end: "10:00" }, { date: "2026-10-23", start: "10:30", end: "11:30" }
    ]}
  ],
  nurses: [
    { id: "N01", name: "護理師 A", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-06","2026-10-13","2026-10-20"], maxVisits: 3 },
    { id: "N02", name: "護理師 B", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-08","2026-10-15","2026-10-22"], maxVisits: 3 },
    { id: "N03", name: "護理師 C", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-09","2026-10-16","2026-10-23"], maxVisits: 3 },
    { id: "N04", name: "護理師 D", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-13","2026-10-20","2026-10-27"], maxVisits: 3 },
    { id: "N05", name: "護理師 E", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-08","2026-10-15","2026-10-22"], maxVisits: 3 },
    { id: "N06", name: "護理師 F", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-09","2026-10-16","2026-10-23"], maxVisits: 3 },
    { id: "N07", name: "護理師 G", workDays: [1,2,3,4,5], vehicleDates: ["2026-10-07","2026-10-14","2026-10-21"], maxVisits: 3 }
  ],
  vehicles: [
    { date: "2026-10-06", capacity: 4 }, { date: "2026-10-07", capacity: 3 }, { date: "2026-10-08", capacity: 4 },
    { date: "2026-10-09", capacity: 4 }, { date: "2026-10-13", capacity: 4 }, { date: "2026-10-14", capacity: 3 },
    { date: "2026-10-15", capacity: 4 }, { date: "2026-10-16", capacity: 4 }, { date: "2026-10-20", capacity: 4 },
    { date: "2026-10-21", capacity: 3 }, { date: "2026-10-22", capacity: 4 }, { date: "2026-10-23", capacity: 4 },
    { date: "2026-10-27", capacity: 4 }
  ],
  cases: [
    { id:"H001", alias:"個案 H-01", zone:"安南區", nurseId:"N01", doctorId:"D01", type:"doctor", dueStart:"2026-10-01", dueEnd:"2026-10-15", preferredPeriod:"上午", preferredDays:[2,4], needsVehicle:true, duration:60 },
    { id:"H002", alias:"個案 H-02", zone:"安南區", nurseId:"N01", doctorId:"", type:"nurse", dueStart:"2026-10-01", dueEnd:"2026-10-10", preferredPeriod:"上午", preferredDays:[2,3], needsVehicle:true, duration:60 },
    { id:"H003", alias:"個案 H-03", zone:"永康區", nurseId:"N02", doctorId:"D02", type:"doctor", dueStart:"2026-10-01", dueEnd:"2026-10-20", preferredPeriod:"下午", preferredDays:[4], needsVehicle:true, duration:60 },
    { id:"H004", alias:"個案 H-04", zone:"永康區", nurseId:"N02", doctorId:"", type:"nurse", dueStart:"2026-10-05", dueEnd:"2026-10-18", preferredPeriod:"下午", preferredDays:[4,5], needsVehicle:true, duration:60 },
    { id:"H005", alias:"個案 H-05", zone:"北區", nurseId:"N03", doctorId:"D03", type:"doctor", dueStart:"2026-10-10", dueEnd:"2026-10-20", preferredPeriod:"上午", preferredDays:[5], needsVehicle:true, duration:60 },
    { id:"H006", alias:"個案 H-06", zone:"北區", nurseId:"N03", doctorId:"", type:"nurse", dueStart:"2026-10-10", dueEnd:"2026-10-25", preferredPeriod:"上午", preferredDays:[5], needsVehicle:true, duration:45 },
    { id:"H007", alias:"個案 H-07", zone:"安南區", nurseId:"N04", doctorId:"D01", type:"doctor", dueStart:"2026-10-10", dueEnd:"2026-10-25", preferredPeriod:"上午", preferredDays:[2], needsVehicle:true, duration:60 },
    { id:"H008", alias:"個案 H-08", zone:"安南區", nurseId:"N04", doctorId:"", type:"nurse", dueStart:"2026-10-15", dueEnd:"2026-10-31", preferredPeriod:"下午", preferredDays:[2], needsVehicle:true, duration:60 },
    { id:"H009", alias:"個案 H-09", zone:"仁德區", nurseId:"N05", doctorId:"D02", type:"doctor", dueStart:"2026-10-10", dueEnd:"2026-10-25", preferredPeriod:"下午", preferredDays:[4], needsVehicle:true, duration:60 },
    { id:"H010", alias:"個案 H-10", zone:"仁德區", nurseId:"N05", doctorId:"", type:"nurse", dueStart:"2026-10-10", dueEnd:"2026-10-26", preferredPeriod:"下午", preferredDays:[4], needsVehicle:true, duration:45 },
    { id:"H011", alias:"個案 H-11", zone:"新市區", nurseId:"N06", doctorId:"D03", type:"doctor", dueStart:"2026-10-15", dueEnd:"2026-10-30", preferredPeriod:"上午", preferredDays:[5], needsVehicle:true, duration:60 },
    { id:"H012", alias:"個案 H-12", zone:"新市區", nurseId:"N06", doctorId:"", type:"nurse", dueStart:"2026-10-12", dueEnd:"2026-10-28", preferredPeriod:"下午", preferredDays:[5], needsVehicle:true, duration:60 },
    { id:"H013", alias:"個案 H-13", zone:"安南區", nurseId:"N01", doctorId:"D01", type:"doctor", dueStart:"2026-10-15", dueEnd:"2026-10-30", preferredPeriod:"上午", preferredDays:[2], needsVehicle:true, duration:60 },
    { id:"H014", alias:"個案 H-14", zone:"永康區", nurseId:"N02", doctorId:"D02", type:"doctor", dueStart:"2026-10-12", dueEnd:"2026-10-30", preferredPeriod:"下午", preferredDays:[4], needsVehicle:true, duration:60 },
    { id:"H015", alias:"個案 H-15", zone:"北區", nurseId:"N03", doctorId:"", type:"nurse", dueStart:"2026-10-01", dueEnd:"2026-10-31", preferredPeriod:"下午", preferredDays:[5], needsVehicle:true, duration:45 },
    { id:"H016", alias:"個案 H-16", zone:"安南區", nurseId:"N04", doctorId:"", type:"nurse", dueStart:"2026-10-01", dueEnd:"2026-10-31", preferredPeriod:"上午", preferredDays:[2], needsVehicle:true, duration:60 },
    { id:"H017", alias:"個案 H-17", zone:"永康區", nurseId:"N05", doctorId:"D02", type:"doctor", dueStart:"2026-10-01", dueEnd:"2026-10-03", preferredPeriod:"下午", preferredDays:[4], needsVehicle:true, duration:60 },
    { id:"H018", alias:"個案 H-18", zone:"新市區", nurseId:"N07", doctorId:"D03", type:"doctor", dueStart:"2026-10-01", dueEnd:"2026-10-31", preferredPeriod:"上午", preferredDays:[5], needsVehicle:true, duration:60 },
    { id:"H019", alias:"個案 H-19", zone:"安南區", nurseId:"N07", doctorId:"", type:"nurse", dueStart:"2026-10-01", dueEnd:"2026-10-20", preferredPeriod:"上午", preferredDays:[3], needsVehicle:true, duration:60 },
    { id:"H020", alias:"個案 H-20", zone:"新市區", nurseId:"N06", doctorId:"", type:"nurse", dueStart:"2026-10-01", dueEnd:"2026-10-31", preferredPeriod:"下午", preferredDays:[5], needsVehicle:true, duration:45 }
  ]
};

const settings = {
  maxVisits: 3,
  enforceDoctor: true,
  enforceNurse: true,
  enforceVehicle: true,
  enforceDue: true,
  preferZone: true,
  preferPrimary: true,
  preferFamily: true,
  balanceLoad: true
};

let state = clone(defaultData);
let schedule = [];
let issues = [];
let importedRows = {};

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function byId(list, id) { return list.find(item => item.id === id); }
function pad(value) { return String(value).padStart(2, "0"); }
function dateLabel(date) { const [, month, day] = date.split("-"); return `${Number(month)}/${Number(day)}`; }
function dayOfWeek(date) { return new Date(`${date}T12:00:00`).getDay(); }
function isMorning(time) { return Number(time.split(":")[0]) < 12; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char])); }
function csvCell(value) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function addMinutes(time, minutes) { const [h,m] = time.split(":").map(Number); const total = h*60+m+Number(minutes || 60); return `${pad(Math.floor(total/60)%24)}:${pad(total%60)}`; }
function overlaps(startA, endA, startB, endB) { return startA < endB && startB < endA; }
function datesInMonth() { return Array.from({length:31}, (_,i) => `${MONTH}-${pad(i+1)}`); }

function getVehicleCapacity(date) { return Number(state.vehicles.find(v => v.date === date)?.capacity || 0); }
function getVehicleUsage(date) { return schedule.filter(event => event.date === date && event.needsVehicle).length; }
function visitClass(type) { return type === "doctor" ? "doctor" : "nurse"; }
function visitLabel(type) { return type === "doctor" ? "醫師訪視" : "護理師訪視"; }

function candidateReason(item) {
  const nurse = byId(state.nurses, item.nurseId);
  const doctor = byId(state.doctors, item.doctorId);
  if (!nurse) return "個案沒有可辨識的主責護理師";
  if (item.type === "doctor" && !doctor) return "醫師訪視但沒有可辨識的醫師";
  const dueDates = datesInMonth().filter(date => date >= item.dueStart && date <= item.dueEnd);
  if (!dueDates.length) return "訪視期限不在目前排程月份";
  if (item.type === "doctor" && !doctor.slots.some(slot => slot.date >= item.dueStart && slot.date <= item.dueEnd)) return "期限內沒有醫師可訪時段";
  const baseDates = item.type === "doctor" ? doctor.slots.map(slot => slot.date) : dueDates;
  const nurseDates = [...new Set(baseDates)].filter(date => nurse.workDays.includes(dayOfWeek(date)));
  if (!nurseDates.length) return "醫師／個案可行日期與護理師班表無交集";
  if (item.needsVehicle && !nurseDates.some(date => nurse.vehicleDates.includes(date) && getVehicleCapacity(date) > 0)) return "可行日期與主責護理師用車日無交集";
  return "可行時段已被其他行程或車輛容量占用";
}

function buildCandidates(item, workingSchedule) {
  const nurse = byId(state.nurses, item.nurseId);
  const doctor = byId(state.doctors, item.doctorId);
  if (!nurse || (item.type === "doctor" && !doctor)) return [];
  const rawSlots = item.type === "doctor"
    ? doctor.slots.map(slot => ({...slot}))
    : datesInMonth().flatMap(date => ["09:00","10:30","14:00","15:30"].map(start => ({date,start,end:addMinutes(start,item.duration)})));

  return rawSlots.filter(slot => {
    if (settings.enforceDue && (slot.date < item.dueStart || slot.date > item.dueEnd)) return false;
    if (settings.enforceNurse && !nurse.workDays.includes(dayOfWeek(slot.date))) return false;
    if (item.needsVehicle && settings.enforceVehicle) {
      if (!nurse.vehicleDates.includes(slot.date) || getVehicleCapacity(slot.date) < 1) return false;
      const used = workingSchedule.filter(event => event.date === slot.date && event.needsVehicle).length;
      if (used >= getVehicleCapacity(slot.date)) return false;
    }
    const nurseDayEvents = workingSchedule.filter(event => event.nurseId === item.nurseId && event.date === slot.date);
    const max = Math.min(Number(nurse.maxVisits || settings.maxVisits), Number(settings.maxVisits));
    if (nurseDayEvents.length >= max) return false;
    if (nurseDayEvents.some(event => overlaps(slot.start, slot.end, event.start, event.end))) return false;
    if (item.type === "doctor" && workingSchedule.some(event => event.doctorId === item.doctorId && event.date === slot.date && overlaps(slot.start, slot.end, event.start, event.end))) return false;
    return true;
  }).map(slot => {
    const sameDay = workingSchedule.filter(event => event.nurseId === item.nurseId && event.date === slot.date);
    let score = Number(slot.date.slice(-2)) * 0.12 + sameDay.length * 3;
    if (settings.preferZone && sameDay.some(event => event.zone === item.zone)) score -= 10;
    if (settings.preferPrimary && sameDay.length) score -= 3;
    if (settings.preferFamily && ((item.preferredPeriod === "上午" && isMorning(slot.start)) || (item.preferredPeriod === "下午" && !isMorning(slot.start)))) score -= 7;
    if (settings.preferFamily && item.preferredDays?.includes(dayOfWeek(slot.date))) score -= 4;
    if (settings.balanceLoad) score += workingSchedule.filter(event => event.nurseId === item.nurseId).length * 0.8;
    return {...slot, score};
  }).sort((a,b) => a.score - b.score || a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
}

function runSmartScheduler(showMessage = true) {
  const previousStatuses = Object.fromEntries(schedule.map(event => [event.caseId, event.status]));
  const nextSchedule = [];
  const nextIssues = [];
  const sortedCases = [...state.cases].sort((a,b) => (a.type === b.type ? a.dueEnd.localeCompare(b.dueEnd) : a.type === "doctor" ? -1 : 1));

  sortedCases.forEach((item, index) => {
    const candidates = buildCandidates(item, nextSchedule);
    if (!candidates.length) {
      nextIssues.push({ caseId:item.id, alias:item.alias, type:item.type, reason:candidateReason(item) });
      return;
    }
    const chosen = candidates[0];
    nextSchedule.push({
      id:`EV-${item.id}`,
      caseId:item.id,
      alias:item.alias,
      type:item.type,
      zone:item.zone,
      nurseId:item.nurseId,
      doctorId:item.doctorId,
      date:chosen.date,
      start:chosen.start,
      end:addMinutes(chosen.start,item.duration),
      duration:item.duration,
      needsVehicle:item.needsVehicle,
      manual:false,
      status:previousStatuses[item.id] || STATUS_OPTIONS[index % STATUS_OPTIONS.length]
    });
  });
  schedule = nextSchedule.sort(sortEvents);
  issues = nextIssues;
  renderAll();
  if (showMessage) showToast(`已排入 ${schedule.length} 筆，${issues.length} 筆需要人工決定`);
}

function sortEvents(a,b) { return a.date.localeCompare(b.date) || a.start.localeCompare(b.start); }

function renderAll() {
  renderMetrics();
  renderCalendar();
  renderIssues();
  renderUploads();
  renderTracking();
  renderRules();
}

function renderMetrics() {
  const total = state.cases.length;
  const scheduled = schedule.length;
  const doctorVisits = schedule.filter(event => event.type === "doctor").length;
  const grouped = schedule.filter(event => schedule.some(other => other.id !== event.id && other.nurseId === event.nurseId && other.date === event.date && other.zone === event.zone)).length;
  const cards = [
    { label:"本月應訪", value:total, note:"筆模擬個案", color:"#3155d9", accent:"#edf1ff" },
    { label:"成功排入", value:`${scheduled}/${total}`, note:`完成率 ${total ? Math.round(scheduled/total*100) : 0}%`, color:"#15745c", accent:"#e3f5ed" },
    { label:"醫師訪視", value:doctorVisits, note:"已符合醫師時段", color:"#7656d8", accent:"#eee9ff" },
    { label:"同區集中", value:grouped, note:"筆減少往返", color:"#0f8a83", accent:"#dff5f2" }
  ];
  document.getElementById("metricGrid").innerHTML = cards.map(card => `
    <article class="metric" style="--metric-color:${card.color};--metric-accent:${card.accent}">
      <small>${card.label}</small><strong>${card.value}</strong><em>${card.note}</em>
    </article>`).join("");
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const firstOffset = (new Date("2026-10-01T12:00:00").getDay() + 6) % 7;
  const cells = [];
  for (let i=0; i<firstOffset; i++) cells.push(`<div class="calendar-day muted" aria-hidden="true"></div>`);
  for (let day=1; day<=31; day++) {
    const date = `${MONTH}-${pad(day)}`;
    const dayEvents = schedule.filter(event => event.date === date);
    const car = getVehicleCapacity(date);
    const hasVehicleSetting = state.vehicles.some(item => item.date === date);
    cells.push(`<div class="calendar-day">
      <div class="day-number"><span>${day}</span>${hasVehicleSetting ? `<button type="button" class="vehicle-mark ${car === 0 ? "zero" : ""}" data-vehicle-date="${date}" title="當日最多可安排 ${car} 筆需要用車的訪視，點擊查看或修改" aria-label="${date} 用車上限 ${car} 筆，點擊查看或修改">用車上限 ${car}</button>` : ""}</div>
      <div class="day-events">
        ${dayEvents.slice(0,3).map(event => `<button class="calendar-event ${visitClass(event.type)} ${event.manual ? "manual" : ""}" data-event-id="${event.id}">
          <strong>${event.start} ${escapeHtml(event.alias)}</strong><span>${escapeHtml(byId(state.nurses,event.nurseId)?.name || event.nurseId)} · ${escapeHtml(event.zone)}</span>
        </button>`).join("")}
        ${dayEvents.length > 3 ? `<span class="more-events">另有 ${dayEvents.length-3} 筆</span>` : ""}
      </div>
    </div>`);
  }
  while (cells.length % 7) cells.push(`<div class="calendar-day muted" aria-hidden="true"></div>`);
  grid.innerHTML = cells.join("");
  grid.querySelectorAll("[data-event-id]").forEach(button => button.addEventListener("click", () => openEventDialog(button.dataset.eventId)));
  grid.querySelectorAll("[data-vehicle-date]").forEach(button => button.addEventListener("click", () => openVehicleDialog(button.dataset.vehicleDate)));
}

function renderIssues() {
  const list = document.getElementById("issueList");
  document.getElementById("issueCount").textContent = issues.length;
  list.innerHTML = issues.length ? issues.map(issue => `
    <button type="button" class="issue-item" data-issue-case-id="${issue.caseId}" aria-label="處理${escapeHtml(issue.alias)}未排入問題">
      <div class="issue-item-head"><strong>${escapeHtml(issue.alias)}</strong><span class="issue-tag">${visitLabel(issue.type)}</span></div>
      <p>${escapeHtml(issue.reason)}</p>
      <span class="issue-action">點擊查看並人工處理 →</span>
    </button>`).join("") : `<div class="empty-state">全部個案都有可行安排，仍需人工核對。</div>`;
  list.querySelectorAll("[data-issue-case-id]").forEach(button => button.addEventListener("click", () => openIssueDialog(button.dataset.issueCaseId)));
}

function renderUploads() {
  const container = document.getElementById("uploadGrid");
  const counts = { cases:state.cases.length, doctors:state.doctors.reduce((sum,item)=>sum+item.slots.length,0), nurses:state.nurses.length, vehicles:state.vehicles.length };
  container.innerHTML = Object.entries(DATA_LABELS).map(([key,meta]) => `
    <article class="upload-card">
      <div class="upload-card-head"><div><h3>${meta.title}</h3><p>${meta.description}</p></div><span class="row-count">${counts[key]} 列</span></div>
      <div class="upload-actions">
        <label class="file-label">選擇 ${key}.csv<input type="file" accept=".csv,text/csv" data-upload="${key}" /></label>
        <button class="button ghost small" data-sample="${key}">下載範本</button>
      </div>
      <div class="upload-message ${importedRows[key] ? "success" : ""}" id="message-${key}">${importedRows[key] ? `已匯入 ${importedRows[key]} 列自訂資料` : "目前使用去識別化模擬資料"}</div>
    </article>`).join("");
  container.querySelectorAll("[data-upload]").forEach(input => input.addEventListener("change", event => handleCsvUpload(event, input.dataset.upload)));
  container.querySelectorAll("[data-sample]").forEach(button => button.addEventListener("click", () => downloadSample(button.dataset.sample)));
}

function renderTracking() {
  const pipeline = document.getElementById("pipeline");
  pipeline.innerHTML = STATUS_OPTIONS.map((status,index) => `
    <div class="pipeline-step"><small>階段 ${pad(index+1)}</small><strong>${status}</strong><span class="pipeline-count">${schedule.filter(event => event.status === status).length}</span></div>`).join("");
  const filter = document.getElementById("trackingFilter")?.value || "all";
  const rows = schedule.filter(event => filter === "all" || event.status === filter);
  document.getElementById("trackingTableBody").innerHTML = rows.map(event => `
    <tr>
      <td>${dateLabel(event.date)} ${event.start}</td>
      <td><strong>${escapeHtml(event.alias)}</strong><br><small>${escapeHtml(event.zone)}</small></td>
      <td><span class="type-badge ${visitClass(event.type)}">${visitLabel(event.type)}</span></td>
      <td>${escapeHtml(byId(state.nurses,event.nurseId)?.name || event.nurseId)}</td>
      <td><select class="status-select" data-status-event="${event.id}" aria-label="${escapeHtml(event.alias)}目前狀態">${STATUS_OPTIONS.map(status => `<option ${status === event.status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
    </tr>`).join("");
  document.querySelectorAll("[data-status-event]").forEach(select => select.addEventListener("change", () => {
    const event = schedule.find(item => item.id === select.dataset.statusEvent);
    if (event) event.status = select.value;
    renderTracking();
    showToast(`${event?.alias || "行程"}已更新為「${select.value}」`);
  }));
}

function renderRules() {
  const hardRules = [
    ["enforceDoctor","醫師必須可訪","醫師訪視只能使用醫師提供的時段"],
    ["enforceNurse","護理師必須上班","執行者不可在休假或不可外出日"],
    ["enforceVehicle","用車日必須有車","需要車輛時不得超過每日容量"],
    ["enforceDue","不可超過訪視期限","排程日期必須落在應訪區間內"]
  ];
  const softRules = [
    ["preferZone","優先安排同一地區","減少來回車程與空檔"],
    ["preferPrimary","集中主責護理師個案","盡量把同一人的訪視排在同一天"],
    ["preferFamily","配合家屬偏好時段","偏好不等於絕對限制"],
    ["balanceLoad","平衡護理師工作量","避免訪視過度集中在少數人員"]
  ];
  document.getElementById("hardRules").innerHTML = hardRules.map(rule => ruleRow(rule,true)).join("") + `
    <div class="rule-row"><div class="rule-copy"><strong>每日最多訪視量</strong><small>模擬單位可依內規調整</small></div><input id="maxVisits" class="number-input" type="number" min="1" max="8" value="${settings.maxVisits}" /></div>`;
  document.getElementById("softRules").innerHTML = softRules.map(rule => ruleRow(rule,false)).join("");
  document.querySelectorAll("[data-setting]").forEach(input => input.addEventListener("change", () => { settings[input.dataset.setting] = input.checked; runSmartScheduler(false); showToast("規則已更新並重新計算"); }));
  document.getElementById("maxVisits").addEventListener("change", event => { settings.maxVisits = Math.max(1,Math.min(8,Number(event.target.value)||3)); runSmartScheduler(false); showToast("每日上限已更新"); });
}

function ruleRow([key,title,description], hard) {
  return `<div class="rule-row"><div class="rule-copy"><strong>${title}</strong><small>${description}</small></div><label class="toggle"><input type="checkbox" data-setting="${key}" ${settings[key] ? "checked" : ""} ${hard ? "disabled" : ""}/><span></span></label></div>`;
}

function openEventDialog(id) {
  const event = schedule.find(item => item.id === id);
  if (!event) return;
  document.getElementById("editEventId").value = event.id;
  document.getElementById("dialogTitle").textContent = `${event.alias}｜${visitLabel(event.type)}`;
  document.getElementById("editDate").value = event.date;
  document.getElementById("editTime").value = event.start;
  document.getElementById("editNurse").innerHTML = state.nurses.map(nurse => `<option value="${nurse.id}" ${nurse.id===event.nurseId?"selected":""}>${escapeHtml(nurse.name)}</option>`).join("");
  document.getElementById("editStatus").innerHTML = STATUS_OPTIONS.map(status => `<option ${status===event.status?"selected":""}>${status}</option>`).join("");
  const doctor = byId(state.doctors,event.doctorId);
  document.getElementById("dialogContext").innerHTML = `<strong>目前條件：</strong>${escapeHtml(event.zone)} · ${doctor ? escapeHtml(doctor.name) : "護理師獨立訪視"} · ${event.needsVehicle ? "需要用車" : "不需用車"}`;
  document.getElementById("dialogError").textContent = "";
  document.getElementById("eventDialog").showModal();
}

function openVehicleDialog(date) {
  const capacity = getVehicleCapacity(date);
  const usage = getVehicleUsage(date);
  const dayEvents = schedule.filter(event => event.date === date && event.needsVehicle);
  document.getElementById("vehicleDate").value = date;
  document.getElementById("vehicleCapacity").value = capacity;
  document.getElementById("vehicleDialogTitle").textContent = `${dateLabel(date)} 用車資源`;
  document.getElementById("vehicleSummary").innerHTML = `
    <div><small>當日上限</small><strong>${capacity} 筆</strong></div>
    <div><small>已排使用</small><strong>${usage} 筆</strong></div>
    <div><small>剩餘容量</small><strong>${Math.max(0,capacity-usage)} 筆</strong></div>`;
  document.getElementById("vehicleEventList").innerHTML = dayEvents.length
    ? `<strong class="mini-title">目前需要用車的行程</strong>${dayEvents.map(event => `<div><span>${event.start}</span><b>${escapeHtml(event.alias)}</b><small>${escapeHtml(byId(state.nurses,event.nurseId)?.name || event.nurseId)}</small></div>`).join("")}`
    : `<div class="empty-inline">目前尚未排入需要用車的訪視。</div>`;
  document.getElementById("vehicleDialog").showModal();
}

function saveVehicleCapacity(eventObject) {
  eventObject.preventDefault();
  const date = document.getElementById("vehicleDate").value;
  const capacity = Math.max(0,Math.min(20,Number(document.getElementById("vehicleCapacity").value) || 0));
  const record = state.vehicles.find(item => item.date === date);
  if (record) record.capacity = capacity;
  else state.vehicles.push({date,capacity});
  document.getElementById("vehicleDialog").close();
  runSmartScheduler(false);
  showToast(`${dateLabel(date)}用車上限已改為 ${capacity} 筆，並重新排程`);
}

function openIssueDialog(caseId) {
  const issue = issues.find(item => item.caseId === caseId);
  const item = byId(state.cases,caseId);
  if (!issue || !item) return;
  const doctor = byId(state.doctors,item.doctorId);
  const firstSlot = item.type === "doctor"
    ? doctor?.slots.find(slot => slot.date >= item.dueStart && slot.date <= item.dueEnd)
    : null;
  document.getElementById("issueCaseId").value = caseId;
  document.getElementById("issueDialogTitle").textContent = `${item.alias}｜${visitLabel(item.type)}`;
  document.getElementById("issueDialogReason").innerHTML = `<strong>未排入原因</strong><p>${escapeHtml(issue.reason)}</p>`;
  document.getElementById("issueNurse").innerHTML = state.nurses.map(nurse => `<option value="${nurse.id}" ${nurse.id===item.nurseId?"selected":""}>${escapeHtml(nurse.name)}</option>`).join("");
  const doctorWrap = document.getElementById("issueDoctorWrap");
  doctorWrap.hidden = item.type !== "doctor";
  document.getElementById("issueDoctor").innerHTML = `<option value="">請選擇醫師</option>${state.doctors.map(person => `<option value="${person.id}" ${person.id===item.doctorId?"selected":""}>${escapeHtml(person.name)}</option>`).join("")}`;
  document.getElementById("issueDueStart").value = item.dueStart;
  document.getElementById("issueDueEnd").value = item.dueEnd;
  document.getElementById("issueDate").value = firstSlot?.date || item.dueStart;
  document.getElementById("issueTime").value = firstSlot?.start || (item.preferredPeriod === "下午" ? "14:00" : "09:00");
  document.getElementById("issueNeedsVehicle").checked = item.needsVehicle;
  document.getElementById("issueDialogContext").innerHTML = `<strong>個案條件：</strong>${escapeHtml(item.zone)} · ${item.duration} 分鐘。可修改主責、醫師、期限與用車需求，再重新計算或直接人工排入。`;
  document.getElementById("issueDialogError").textContent = "";
  document.getElementById("issueDialog").showModal();
}

function readIssueForm() {
  const item = byId(state.cases,document.getElementById("issueCaseId").value);
  return {
    item,
    nurseId:document.getElementById("issueNurse").value,
    doctorId:item?.type === "doctor" ? document.getElementById("issueDoctor").value : "",
    dueStart:document.getElementById("issueDueStart").value,
    dueEnd:document.getElementById("issueDueEnd").value,
    date:document.getElementById("issueDate").value,
    start:document.getElementById("issueTime").value,
    needsVehicle:document.getElementById("issueNeedsVehicle").checked
  };
}

function suggestIssueDoctorSlot() {
  const item = byId(state.cases,document.getElementById("issueCaseId").value);
  if (!item || item.type !== "doctor") return;
  const doctor = byId(state.doctors,document.getElementById("issueDoctor").value);
  const dueStart = document.getElementById("issueDueStart").value;
  const dueEnd = document.getElementById("issueDueEnd").value;
  const slot = doctor?.slots.find(entry => entry.date >= dueStart && entry.date <= dueEnd);
  if (slot) {
    document.getElementById("issueDate").value = slot.date;
    document.getElementById("issueTime").value = slot.start;
    document.getElementById("issueDialogError").textContent = "";
  } else {
    document.getElementById("issueDialogError").textContent = "目前期限內沒有這位醫師的可訪時段，請調整期限或改選醫師";
  }
}

function validateIssueAssignment(values) {
  const {item,nurseId,doctorId,dueStart,dueEnd,date,start,needsVehicle} = values;
  if (!item) return {error:"找不到這筆個案資料"};
  if (dueStart > dueEnd) return {error:"訪視期限開始日期不可晚於結束日期"};
  if (date < dueStart || date > dueEnd) return {error:"人工安排日期不在訪視期限內"};
  const nurse = byId(state.nurses,nurseId);
  if (!nurse) return {error:"請選擇可辨識的護理師"};
  if (!nurse.workDays.includes(dayOfWeek(date))) return {error:"選擇的護理師當日不在可排班星期內"};
  if (needsVehicle) {
    if (!nurse.vehicleDates.includes(date)) return {error:"選擇的護理師當日不是可用車日"};
    if (getVehicleCapacity(date) < 1) return {error:"當日用車上限為 0，請先修改月曆上的用車上限"};
    if (getVehicleUsage(date) >= getVehicleCapacity(date)) return {error:"當日用車容量已滿，請提高上限或改期"};
  }
  let end = addMinutes(start,item.duration);
  if (item.type === "doctor") {
    const doctor = byId(state.doctors,doctorId);
    if (!doctor) return {error:"醫師訪視必須選擇醫師"};
    const slot = doctor.slots.find(entry => entry.date===date && entry.start===start);
    if (!slot) return {error:"選擇的日期與時間不在該醫師提供的可訪時段"};
    end = slot.end;
    if (schedule.some(event => event.doctorId===doctorId && event.date===date && overlaps(start,end,event.start,event.end))) return {error:"該醫師同一時間已有其他訪視"};
  }
  const nurseEvents = schedule.filter(event => event.nurseId===nurseId && event.date===date);
  const max = Math.min(Number(nurse.maxVisits || settings.maxVisits),Number(settings.maxVisits));
  if (nurseEvents.length >= max) return {error:`該護理師當日已達 ${max} 筆訪視上限`};
  if (nurseEvents.some(event => overlaps(start,end,event.start,event.end))) return {error:"該護理師同一時間已有其他訪視"};
  return {error:"",end};
}

function updateIssueCase(values) {
  Object.assign(values.item,{
    nurseId:values.nurseId,
    doctorId:values.doctorId,
    dueStart:values.dueStart,
    dueEnd:values.dueEnd,
    needsVehicle:values.needsVehicle
  });
}

function retryIssueSchedule() {
  const values = readIssueForm();
  if (!values.item) return;
  if (values.dueStart > values.dueEnd) {
    document.getElementById("issueDialogError").textContent = "訪視期限開始日期不可晚於結束日期";
    return;
  }
  if (values.item.type === "doctor" && !values.doctorId) {
    document.getElementById("issueDialogError").textContent = "醫師訪視必須選擇醫師";
    return;
  }
  updateIssueCase(values);
  document.getElementById("issueDialog").close();
  runSmartScheduler(false);
  const stillUnscheduled = issues.some(issue => issue.caseId === values.item.id);
  showToast(stillUnscheduled ? `${values.item.alias}仍有衝突，請再次點開查看` : `${values.item.alias}已依更新條件排入`);
}

function saveIssueAssignment(eventObject) {
  eventObject.preventDefault();
  const values = readIssueForm();
  const validation = validateIssueAssignment(values);
  if (validation.error) {
    document.getElementById("issueDialogError").textContent = validation.error;
    return;
  }
  updateIssueCase(values);
  schedule.push({
    id:`EV-${values.item.id}`,
    caseId:values.item.id,
    alias:values.item.alias,
    type:values.item.type,
    zone:values.item.zone,
    nurseId:values.nurseId,
    doctorId:values.doctorId,
    date:values.date,
    start:values.start,
    end:validation.end,
    duration:values.item.duration,
    needsVehicle:values.needsVehicle,
    manual:true,
    status:"待送報備"
  });
  schedule.sort(sortEvents);
  issues = issues.filter(issue => issue.caseId !== values.item.id);
  document.getElementById("issueDialog").close();
  renderAll();
  showToast(`${values.item.alias}已人工排入，並標示為人工調整`);
}

function validateManualChange(event, next) {
  const nurse = byId(state.nurses,next.nurseId);
  if (!nurse) return "找不到選擇的護理師";
  if (!nurse.workDays.includes(dayOfWeek(next.date))) return "該護理師當日不在可排班星期內";
  if (event.needsVehicle && (!nurse.vehicleDates.includes(next.date) || getVehicleCapacity(next.date) < 1)) return "該護理師當日沒有可用車日";
  const originalCase = byId(state.cases,event.caseId);
  if (next.date < originalCase.dueStart || next.date > originalCase.dueEnd) return "日期超出這位個案的訪視期限";
  if (event.type === "doctor") {
    const doctor = byId(state.doctors,event.doctorId);
    if (!doctor?.slots.some(slot => slot.date===next.date && slot.start===next.start)) return "這個日期與時間不在醫師提供的可訪時段";
  }
  const nextEnd = addMinutes(next.start,event.duration);
  if (schedule.some(other => other.id!==event.id && other.nurseId===next.nurseId && other.date===next.date && overlaps(next.start,nextEnd,other.start,other.end))) return "該護理師同一時間已有其他訪視";
  return "";
}

function saveManualEvent(eventObject) {
  eventObject.preventDefault();
  const event = schedule.find(item => item.id === document.getElementById("editEventId").value);
  if (!event) return;
  const next = { date:document.getElementById("editDate").value, start:document.getElementById("editTime").value, nurseId:document.getElementById("editNurse").value };
  const error = validateManualChange(event,next);
  if (error) { document.getElementById("dialogError").textContent = error; return; }
  Object.assign(event,next,{ end:addMinutes(next.start,event.duration), status:document.getElementById("editStatus").value, manual:true });
  schedule.sort(sortEvents);
  document.getElementById("eventDialog").close();
  renderAll();
  showToast("已儲存人工調整，並保留調整標記");
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i=0; i<text.length; i++) {
    const char = text[i];
    const next = text[i+1];
    if (char === '"' && quoted && next === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field.trim()); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(field.trim());
      if (row.some(value => value !== "")) rows.push(row);
      row = []; field = "";
    } else field += char;
  }
  row.push(field.trim());
  if (row.some(value => value !== "")) rows.push(row);
  if (rows.length < 2) return { headers:rows[0]||[], records:[] };
  const headers = rows[0].map(value => value.replace(/^\uFEFF/, ""));
  return { headers, records:rows.slice(1).map(values => Object.fromEntries(headers.map((header,index)=>[header,values[index]??""]))) };
}

async function handleCsvUpload(event, type) {
  const input = event.target;
  const message = document.getElementById(`message-${type}`);
  if (!input.files?.[0]) return;
  try {
    const parsed = parseCSV(await input.files[0].text());
    const missing = DATA_LABELS[type].required.filter(header => !parsed.headers.includes(header));
    if (missing.length) throw new Error(`缺少欄位：${missing.join("、")}`);
    if (!parsed.records.length) throw new Error("CSV沒有資料列");
    applyImportedData(type,parsed.records);
    importedRows[type] = parsed.records.length;
    message.className = "upload-message success";
    message.textContent = `成功讀取 ${parsed.records.length} 列；尚未重新排程`;
    showToast(`${DATA_LABELS[type].title}已匯入`);
  } catch (error) {
    message.className = "upload-message error";
    message.textContent = error.message || "無法讀取CSV";
  }
}

function applyImportedData(type,records) {
  if (type === "cases") state.cases = records.map(row => ({
    id:row.case_id, alias:row.alias, zone:row.zone, nurseId:row.primary_nurse_id, doctorId:row.doctor_id,
    type:String(row.visit_type).toLowerCase().includes("doctor") || String(row.visit_type).includes("醫師") ? "doctor" : "nurse",
    dueStart:row.due_start, dueEnd:row.due_end, preferredPeriod:row.preferred_period || "上午", preferredDays:[],
    needsVehicle:["true","1","是","yes"].includes(String(row.needs_vehicle).toLowerCase()), duration:Number(row.duration_min)||60
  }));
  if (type === "doctors") {
    const grouped = {};
    records.forEach(row => { grouped[row.doctor_id] ||= {id:row.doctor_id,name:row.doctor_name,slots:[]}; grouped[row.doctor_id].slots.push({date:row.date,start:row.start_time,end:row.end_time}); });
    state.doctors = Object.values(grouped);
  }
  if (type === "nurses") state.nurses = records.map(row => ({ id:row.nurse_id, name:row.nurse_name, workDays:row.work_days.split("|").map(Number), vehicleDates:row.vehicle_dates.split("|").filter(Boolean), maxVisits:Number(row.max_visits)||3 }));
  if (type === "vehicles") state.vehicles = records.map(row => ({date:row.date,capacity:Number(row.capacity)||0}));
}

function sampleCSV(type) {
  if (type === "cases") return `case_id,alias,zone,primary_nurse_id,doctor_id,visit_type,due_start,due_end,preferred_period,needs_vehicle,duration_min\nH101,個案 H-101,安南區,N01,D01,doctor,2026-10-01,2026-10-15,上午,true,60\nH102,個案 H-102,安南區,N01,,nurse,2026-10-01,2026-10-20,下午,true,45`;
  if (type === "doctors") return `doctor_id,doctor_name,date,start_time,end_time\nD01,林醫師,2026-10-06,09:00,10:00\nD01,林醫師,2026-10-06,10:30,11:30`;
  if (type === "nurses") return `nurse_id,nurse_name,work_days,vehicle_dates,max_visits\nN01,護理師 A,1|2|3|4|5,2026-10-06|2026-10-13|2026-10-20,3`;
  return `date,capacity\n2026-10-06,4\n2026-10-13,4`;
}

function downloadSample(type) { downloadText(`${type}_template.csv`, `\uFEFF${sampleCSV(type)}`, "text/csv;charset=utf-8"); }

function downloadCalendarCSV() {
  const headers = ["Subject","Start Date","Start Time","End Date","End Time","All Day Event","Description","Location","Private"];
  const rows = schedule.map(event => {
    const [year,month,day] = event.date.split("-");
    const nurse = byId(state.nurses,event.nurseId)?.name || event.nurseId;
    const doctor = byId(state.doctors,event.doctorId)?.name || "";
    return [
      `[${visitLabel(event.type)}] ${event.alias}`, `${month}/${day}/${year}`, event.start, `${month}/${day}/${year}`, event.end, "False",
      `主責：${nurse}${doctor?`；醫師：${doctor}`:""}；狀態：${event.status}；模擬資料`, event.zone, "True"
    ];
  });
  downloadText("home-care-schedule-2026-10.csv", `\uFEFF${[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n")}`, "text/csv;charset=utf-8");
  showToast("已產生Google Calendar可匯入的CSV快照");
}

function icsEscape(value) { return String(value).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n"); }
function icsDate(date,time) { return `${date.replaceAll("-","")}T${time.replace(":","")}00`; }
function downloadICS() {
  const now = new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const body = schedule.map(event => {
    const nurse = byId(state.nurses,event.nurseId)?.name || event.nurseId;
    const doctor = byId(state.doctors,event.doctorId)?.name || "";
    return ["BEGIN:VEVENT",`UID:${event.id}@home-care-simulator`,`DTSTAMP:${now}`,`DTSTART;TZID=Asia/Taipei:${icsDate(event.date,event.start)}`,`DTEND;TZID=Asia/Taipei:${icsDate(event.date,event.end)}`,`SUMMARY:${icsEscape(`[${visitLabel(event.type)}] ${event.alias}`)}`,`DESCRIPTION:${icsEscape(`主責：${nurse}${doctor?`；醫師：${doctor}`:""}；狀態：${event.status}；模擬資料`)}`,`LOCATION:${icsEscape(event.zone)}`,"END:VEVENT"].join("\r\n");
  }).join("\r\n");
  downloadText("home-care-schedule-2026-10.ics", `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Home Care Smart Scheduler//ZH-TW\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n${body}\r\nEND:VCALENDAR`, "text/calendar;charset=utf-8");
  showToast("已產生ICS行事曆檔案");
}

function downloadText(filename,text,mime) {
  const url = URL.createObjectURL(new Blob([text],{type:mime}));
  const anchor = document.createElement("a");
  anchor.href=url; anchor.download=filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}

function showAllEvents() {
  const list = document.getElementById("allEventsList");
  list.innerHTML = schedule.map(event => `<div class="all-event-row"><strong>${dateLabel(event.date)} ${event.start}</strong><span>${escapeHtml(event.alias)} · ${escapeHtml(event.zone)}</span><span>${visitLabel(event.type)}</span><span>${escapeHtml(byId(state.nurses,event.nurseId)?.name || event.nurseId)}</span></div>`).join("");
  document.getElementById("listDialog").showModal();
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}

function resetDemo() { state=clone(defaultData); schedule=[]; issues=[]; importedRows={}; runSmartScheduler(false); showToast("已回復去識別化模擬資料"); }

document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item===button));
  document.querySelectorAll(".view").forEach(view=>view.classList.remove("active"));
  document.getElementById(`${button.dataset.view}View`).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}));

document.getElementById("runScheduler").addEventListener("click",()=>runSmartScheduler(true));
document.getElementById("runAfterImport").addEventListener("click",()=>{ runSmartScheduler(true); document.querySelector('[data-view="workspace"]').click(); });
document.getElementById("resetDemo").addEventListener("click",resetDemo);
document.getElementById("exportIcs").addEventListener("click",downloadICS);
document.getElementById("exportCalendarCsv").addEventListener("click",downloadCalendarCSV);
document.getElementById("showAllEvents").addEventListener("click",showAllEvents);
document.getElementById("trackingFilter").addEventListener("change",renderTracking);
document.getElementById("eventForm").addEventListener("submit",saveManualEvent);
document.getElementById("vehicleForm").addEventListener("submit",saveVehicleCapacity);
document.getElementById("issueForm").addEventListener("submit",saveIssueAssignment);
document.getElementById("retryIssue").addEventListener("click",retryIssueSchedule);
document.getElementById("issueDoctor").addEventListener("change",suggestIssueDoctorSlot);
document.getElementById("issueDueStart").addEventListener("change",suggestIssueDoctorSlot);
document.getElementById("issueDueEnd").addEventListener("change",suggestIssueDoctorSlot);
document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close()));

runSmartScheduler(false);
