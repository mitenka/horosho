import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { getDiaryEntries, getAvailableSkills } from "../services/diaryService";

// Load a font asset and return base64 data URL source for @font-face
async function loadFontDataUrl(moduleRef, mime = "font/ttf") {
  const asset = Asset.fromModule(moduleRef);
  if (!asset.downloaded) {
    await asset.downloadAsync();
  }
  const localUri = asset.localUri || asset.uri;
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:${mime};base64,${base64}`;
}

// Format helpers
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatRuDayRange(dates) {
  if (!dates.length) return "";
  const first = dates[0];
  const last = dates[dates.length - 1];
  const fmt = (dt) =>
    dt.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  return `${fmt(first)} — ${fmt(last)}`;
}

function humanReadableFileName(dates) {
  const range = formatRuDayRange(dates);
  return `diary-${range}.pdf`;
}

function dayHeaders(dates) {
  const dayNames = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]; // 0=ВС
  return dates.map((d) => {
    const dow = dayNames[d.getDay()];
    const dom = d.getDate();
    return { dow, dom };
  });
}

function sanitizeSkillName(name) {
  try {
    return String(name).replace(/\*\*/g, "").trim();
  } catch {
    return name;
  }
}

function generateDatesFromToday(days) {
  const arr = [];
  const start = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() - i);
    arr.push(d);
  }
  return arr.reverse(); // oldest -> newest
}

function extractUniqueBehaviors(entriesObj, dates) {
  const map = new Map();
  for (const dt of dates) {
    const key = toDateKey(dt);
    const day = entriesObj[key];
    if (day?.behaviors) {
      for (const b of day.behaviors) {
        if (!map.has(b.id)) map.set(b.id, { id: b.id, name: b.name, type: b.type });
      }
    }
  }
  return Array.from(map.values());
}

function getValueDailyState(entries, date, key) {
  const v = entries[toDateKey(date)]?.dailyState?.[key];
  return v === null || v === undefined ? "" : String(v);
}

function getValueBehavior(entries, date, behaviorId, valueType, behaviorType) {
  const day = entries[toDateKey(date)];
  if (!day?.behaviors) return "";
  const b = day.behaviors.find((x) => x.id === behaviorId);
  if (!b) return "";
  const v = b[valueType];
  if (v === null || v === undefined) return "";
  if (valueType === "action" && behaviorType === "boolean") {
    return v ? "✓" : "×"; // keep current app rule
  }
  return String(v);
}

function isDiaryCompleted(entries, date) {
  return entries[toDateKey(date)]?.isCompleted === true;
}

function getSkillsAssessment(entries, date) {
  const v = entries[toDateKey(date)]?.skillsAssessment;
  return v === null || v === undefined ? "" : String(v);
}

function isSkillUsed(entries, date, skillKey) {
  const used = entries[toDateKey(date)]?.usedSkills;
  if (!Array.isArray(used)) return false;
  return used.includes(skillKey);
}

function buildMainTableHtml({ dates, entries, behaviors, control }) {
  const headers = dayHeaders(dates);

  const section = (title) => `
    <tr class="section-row">
      <td class="label" colspan="${1 + dates.length}">${title}</td>
    </tr>`;

  const headerRow = `
    <tr class="header-row">
      <td class="label"></td>
      ${headers
        .map(
          (h) => `
        <td class="day-header">
          <div class="dow">${h.dow}</div>
          <div class="dom">${h.dom}</div>
        </td>`
        )
        .join("")}
    </tr>`;

  const completedRow = `
    <tr>
      <td class="label">Дневник заполнен сегодня?</td>
      ${dates.map((d) => (isDiaryCompleted(entries, d) ? "<td>✓</td>" : "<td>—</td>")).join("")}
    </tr>`;

  const stateRows = [
    { label: "Эмоциональное страдание", key: "emotional" },
    { label: "Физическое страдание", key: "physical" },
    { label: "Удовольствие", key: "pleasure" },
  ]
    .map(
      (r) => `
      <tr>
        <td class="label">${r.label}</td>
        ${dates.map((d) => `<td>${getValueDailyState(entries, d, r.key)}</td>`).join("")}
      </tr>`
    )
    .join("");

  const desireRows = behaviors
    .map(
      (b) => `
      <tr>
        <td class="label">${b.name}</td>
        ${dates.map((d) => `<td>${getValueBehavior(entries, d, b.id, "desire", b.type)}</td>`).join("")}
      </tr>`
    )
    .join("");

  const actionRows = behaviors
    .map(
      (b) => `
      <tr>
        <td class="label">${b.name}</td>
        ${dates.map((d) => `<td>${getValueBehavior(entries, d, b.id, "action", b.type)}</td>`).join("")}
      </tr>`
    )
    .join("");

  const skillsAssessmentRow = `
    <tr>
      <td class="label">Оценка (0–7)</td>
      ${dates.map((d) => `<td>${getSkillsAssessment(entries, d)}</td>`).join("")}
    </tr>`;

  const dateRange = formatRuDayRange(dates);
  const fmt = (v) => (v === null || v === undefined ? "н/д" : v);
  const controlLine = `Мысли: ${fmt(control?.thoughts)} | Эмоции: ${fmt(control?.emotions)} | Действия: ${fmt(control?.actions)}`;

  return `
  <div class="title">Дневниковая карточка</div>
  <div class="subtitle">${dateRange} • ${controlLine}</div>
  <table class="data-table">
    <colgroup>
      <col class="label-col" />
      ${dates.map(() => `<col class="day-col" />`).join("")}
    </colgroup>
    <thead>${headerRow}</thead>
    <tbody>
      ${completedRow}
      ${section("Состояние (0–5)")}
      ${stateRows}
      ${behaviors.length ? section("Желания, максимальная выраженность в течение дня (0–5)") : ""}
      ${desireRows}
      ${behaviors.length ? section("Действия") : ""}
      ${actionRows}
      ${section("Использованные навыки")}
      ${skillsAssessmentRow}
    </tbody>
  </table>`;
}

function buildPracticeTableHtml({ dates, entries }) {
  const headers = dayHeaders(dates);
  const skillsCatalog = getAvailableSkills();
  const flat = [];
  Object.keys(skillsCatalog).forEach((k) => {
    const cat = skillsCatalog[k];
    (cat.skills || []).forEach((name) => {
      flat.push({
        label: sanitizeSkillName(name),
        key: name,
      });
    });
  });

  const headerRow = `
    <tr class="header-row">
      <td class="label">Практика</td>
      ${headers
        .map(
          (h) => `
        <td class="day-header">
          <div class="dow">${h.dow}</div>
          <div class="dom">${h.dom}</div>
        </td>`
        )
        .join("")}
    </tr>`;

  const rows = flat
    .map(
      (r) => `
      <tr>
        <td class="label">${r.label}</td>
        ${dates.map((d) => `<td>${isSkillUsed(entries, d, r.key) ? "●" : ""}</td>`).join("")}
      </tr>`
    )
    .join("");

  return `
  <div class="practice-page">
    <table class="data-table">
      <colgroup>
        <col class="label-col" />
        ${dates.map(() => `<col class="day-col" />`).join("")}
      </colgroup>
      <thead>${headerRow}</thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function makeHtml({ fontRegularSrc, fontBoldSrc, dates, entries, behaviors, control }) {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4 portrait; margin: 18mm; }
  @font-face { font-family: 'JBM'; src: url('${fontRegularSrc}') format('truetype'); font-style: normal; font-weight: 400; }
  @font-face { font-family: 'JBM'; src: url('${fontBoldSrc}') format('truetype'); font-style: normal; font-weight: 700; }
  * { box-sizing: border-box; }
  body { font-family: 'JBM', -apple-system, system-ui, sans-serif; color: #111; font-size: 12px; }
  .title { font-weight: 700; font-size: 20px; margin-bottom: 6px; }
  .subtitle { color: #555; margin-bottom: 12px; }
  table.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .label-col { width: 42%; }
  .day-col { width: auto; }
  thead td { background: #f2f4f7; font-weight: 700; }
  td { border: 1px solid #e5e7eb; padding: 6px 8px; vertical-align: middle; word-wrap: break-word; }
  td.label { font-weight: 400; color: #111; }
  .section-row td { background: #eef2f7; font-weight: 700; }
  .header-row .day-header { text-align: center; }
  .dow { font-size: 11px; color: #667085; }
  .dom { font-size: 14px; font-weight: 700; color: #111; }
  .practice-page { page-break-before: always; }
</style>
</head>
<body>
  ${buildMainTableHtml({ dates, entries, behaviors, control })}
  ${buildPracticeTableHtml({ dates, entries })}
</body>
</html>`;
}

export async function exportPracticePdf({ exportDays, control }) {
  // 1) Prepare data
  const dates = generateDatesFromToday(exportDays);
  const entries = await getDiaryEntries();
  const behaviors = extractUniqueBehaviors(entries, dates);

  // 2) Fonts (JetBrains Mono Regular/Bold)
  const fontRegularSrc = await loadFontDataUrl(
    require("../assets/fonts/JetBrainsMono-Regular.ttf")
  );
  const fontBoldSrc = await loadFontDataUrl(
    require("../assets/fonts/JetBrainsMono-Bold.ttf")
  );

  // 3) HTML
  const html = makeHtml({ fontRegularSrc, fontBoldSrc, dates, entries, behaviors, control });

  // 4) Print to file
  const { uri } = await Print.printToFileAsync({ html });

  // 5) Move to a human-readable filename
  const fileName = humanReadableFileName(dates);
  const targetUri = FileSystem.documentDirectory + fileName;
  try {
    // If a file already exists with the same name, delete it first
    const info = await FileSystem.getInfoAsync(targetUri);
    if (info.exists) {
      await FileSystem.deleteAsync(targetUri, { idempotent: true });
    }
    await FileSystem.moveAsync({ from: uri, to: targetUri });
    return targetUri;
  } catch (e) {
    // Fallback to the original URI if moving fails
    return uri;
  }
}
