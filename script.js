// ===============================
// Constants & Default Data
// ===============================
const DEFAULT_STUDENTS = [
  {
    index: "0001",
    name: "Tony Stark",
    dob: "2000-05-29",
    address: "Avengers Tower, New York",
    age: 26,
    marks: { Mathematics: 85, Science: 78, English: 92, History: 74, ICT: 88 }
  },
  {
    index: "0002",
    name: "Bruce Wayne",
    dob: "1998-02-15",
    address: "Wayne Manor, Gotham City",
    age: 28,
    marks: { Mathematics: 90, Science: 82, English: 76, History: 88, ICT: 95 }
  },
  {
    index: "0003",
    name: "Peter Parker",
    dob: "2002-08-10",
    address: "Queens, New York",
    age: 23,
    marks: { Mathematics: 70, Science: 85, English: 80, History: 72, ICT: 89 }
  }
];

const DEFAULT_SETTINGS = {
  theme: "dark",
  fontSize: 16,
  density: "comfortable",
  language: "en",
  animations: true,
  timeout: 15,
  hideDob: false,
  printPref: "both",
  notifications: true,
  autosave: true,
  debug: false,
  snapshot: null
};

// ===============================
// State Management
// ===============================
let students = loadFromStorage("students", DEFAULT_STUDENTS);
let settings = loadFromStorage("settings", DEFAULT_SETTINGS);
let currentStudent = null;
let inactivityTimer = null;

// ===============================
// Utility Functions
// ===============================
function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : structuredClone(fallback);
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return structuredClone(fallback);
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (settings.debug) {
      console.log(`Saved ${key} to localStorage:`, value);
    }
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
    showNotification("Failed to save data. Storage might be full.");
  }
}

function showNotification(message) {
  if (settings.notifications) {
    alert(message);
  }
}

function formatDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// ===============================
// DOM Helper Functions
// ===============================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function openModal(modalId) {
  const modal = $(modalId);
  if (modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(element) {
  const modal = element.closest(".modal");
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// ===============================
// Settings Management
// ===============================
function applySettings() {
  const html = $("#html");
  const body = $("#body");

  // Theme
  if (settings.theme === "light") {
    html.classList.add("light-mode");
  } else {
    html.classList.remove("light-mode");
  }

  // Font size
  document.documentElement.style.setProperty("--font-size", `${settings.fontSize}px`);

  // Density
  if (settings.density === "compact") {
    body.classList.add("compact");
  } else {
    body.classList.remove("compact");
  }

  // Animations
  if (settings.animations) {
    html.classList.add("animations");
  } else {
    html.classList.remove("animations");
  }

  // Reset inactivity timer
  resetInactivityTimer();

  if (settings.debug) {
    console.log("Settings applied:", settings);
  }
}

function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  const minutes = Number(settings.timeout) || 15;
  inactivityTimer = setTimeout(() => {
    showNotification("Session timed out due to inactivity.");
    $$(".modal.show").forEach((modal) => closeModal(modal));
    currentStudent = null;
    renderDetails(null);
    renderMarks(null);
  }, minutes * 60 * 1000);
}

// Track user activity
["click", "keydown", "mousemove", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetInactivityTimer, { passive: true });
});

// ===============================
// Rendering Functions
// ===============================
function renderDetails(student) {
  const detailsDiv = $("#details");
  
  if (!student) {
    detailsDiv.innerHTML = '<p style="color: var(--primary);">No student found with that index.</p>';
    return;
  }

  const dobLine = settings.hideDob 
    ? "" 
    : `<p id="dob">D.O.B: ${formatDate(student.dob)}</p>`;

  detailsDiv.innerHTML = `
    <p id="name"><strong>Name:</strong> ${escapeHtml(student.name)}</p>
    ${dobLine}
    <p id="address"><strong>Address:</strong> ${escapeHtml(student.address)}</p>
    <p id="index"><strong>Index:</strong> ${escapeHtml(student.index)}</p>
    <p id="age"><strong>Age:</strong> ${student.age}</p>
  `;
}

function renderMarks(student) {
  const marksInfo = $(".marks-info");
  
  if (!student) {
    marksInfo.innerHTML = `
      <p class="status-text">Student Marks</p>
      <table class="marks-table">
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>-</td><td>-</td></tr>
        </tbody>
      </table>
    `;
    return;
  }

  const rows = Object.entries(student.marks)
    .map(([subject, mark]) => `<tr><td>${escapeHtml(subject)}</td><td>${mark}</td></tr>`)
    .join("");

  marksInfo.innerHTML = `
    <p class="status-text">Student Marks</p>
    <table class="marks-table">
      <thead>
        <tr>
          <th scope="col">Subject</th>
          <th scope="col">Marks</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function escapeHtml(unsafe) {
  const div = document.createElement("div");
  div.textContent = unsafe;
  return div.innerHTML;
}

// ===============================
// Student Search
// ===============================
function handleSearch() {
  const indexInput = $("#search-index");
  const searchValue = indexInput.value.trim();
  
  if (!searchValue) {
    showNotification("Please enter an index number.");
    return;
  }

  currentStudent = students.find((s) => s.index === searchValue) || null;
  renderDetails(currentStudent);
  renderMarks(currentStudent);

  if (!currentStudent) {
    showNotification("No student found with that index.");
  }
}

// ===============================
// New Admission
// ===============================
function handleNewAdmission(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  const index = formData.get("index").trim();
  
  // Check for duplicate index
  if (students.some((s) => s.index === index)) {
    showNotification("Index already exists. Please choose a unique index.");
    return;
  }

  // Create new student object
  const newStudent = {
    index,
    name: formData.get("name").trim(),
    dob: formData.get("dob"),
    address: formData.get("address").trim(),
    age: Number(formData.get("age")),
    marks: {
      Mathematics: Number(formData.get("Mathematics")),
      Science: Number(formData.get("Science")),
      English: Number(formData.get("English")),
      History: Number(formData.get("History")),
      ICT: Number(formData.get("ICT"))
    }
  };

  students.push(newStudent);
  
  if (settings.autosave) {
    saveToStorage("students", students);
  }

  currentStudent = newStudent;
  renderDetails(currentStudent);
  renderMarks(currentStudent);
  
  closeModal(form);
  form.reset();
  showNotification("Student created successfully.");
}

// ===============================
// Edit Student
// ===============================
function openEditModal() {
  if (!currentStudent) {
    showNotification("Please load a student by index before editing.");
    return;
  }

  const form = $("#edit-form");
  form.index.value = currentStudent.index;
  form.name.value = currentStudent.name;
  form.dob.value = currentStudent.dob;
  form.address.value = currentStudent.address;
  form.age.value = currentStudent.age;
  form.Mathematics.value = currentStudent.marks.Mathematics;
  form.Science.value = currentStudent.marks.Science;
  form.English.value = currentStudent.marks.English;
  form.History.value = currentStudent.marks.History;
  form.ICT.value = currentStudent.marks.ICT;

  openModal("#modal-edit");
}

function handleEditStudent(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  const index = formData.get("index");
  const student = students.find((s) => s.index === index);
  
  if (!student) {
    showNotification("Student not found.");
    return;
  }

  // Update student data
  student.name = formData.get("name").trim();
  student.dob = formData.get("dob");
  student.address = formData.get("address").trim();
  student.age = Number(formData.get("age"));
  student.marks = {
    Mathematics: Number(formData.get("Mathematics")),
    Science: Number(formData.get("Science")),
    English: Number(formData.get("English")),
    History: Number(formData.get("History")),
    ICT: Number(formData.get("ICT"))
  };

  if (settings.autosave) {
    saveToStorage("students", students);
  }

  currentStudent = student;
  renderDetails(currentStudent);
  renderMarks(currentStudent);
  
  closeModal(form);
  showNotification("Student updated successfully.");
}

// ===============================
// Report & Rating
// ===============================
function openReportModal() {
  if (!currentStudent) {
    showNotification("Please load a student by index before reporting.");
    return;
  }

  const starsContainer = $("#modal-report .stars");
  starsContainer.innerHTML = "";
  const maxStars = Number(starsContainer.dataset.max) || 6;

  for (let i = 1; i <= maxStars; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "★";
    star.dataset.value = i;
    star.setAttribute("role", "radio");
    star.setAttribute("aria-label", `${i} star${i > 1 ? "s" : ""}`);
    starsContainer.appendChild(star);
  }

  openModal("#modal-report");
}

function handleStarClick(e) {
  if (!e.target.classList.contains("star")) return;
  
  const value = Number(e.target.dataset.value);
  const stars = $$("#modal-report .star");
  
  stars.forEach((star) => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle("active", starValue <= value);
  });

  $("#modal-report").dataset.rating = String(value);
}

function handleReportSubmit(e) {
  e.preventDefault();
  
  const rating = Number($("#modal-report").dataset.rating || 0);
  const comments = e.target.comments.value.trim();

  if (!rating) {
    showNotification("Please select a star rating (1-6).");
    return;
  }

  currentStudent.report = {
    rating,
    comments,
    date: new Date().toISOString()
  };

  if (settings.autosave) {
    saveToStorage("students", students);
  }

  closeModal(e.target);
  e.target.reset();
  $("#modal-report").dataset.rating = "0";
  showNotification("Report submitted successfully.");
}

// ===============================
// Share Functionality
// ===============================
async function handleShare() {
  if (!currentStudent) {
    showNotification("Please load a student by index before sharing.");
    return;
  }

  const lines = [
    `Name: ${currentStudent.name}`,
    ...(settings.hideDob ? [] : [`D.O.B: ${formatDate(currentStudent.dob)}`]),
    `Address: ${currentStudent.address}`,
    `Index: ${currentStudent.index}`,
    `Age: ${currentStudent.age}`,
    "",
    "Marks:",
    ...Object.entries(currentStudent.marks).map(([subject, mark]) => `- ${subject}: ${mark}`)
  ];

  const text = lines.join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showNotification("Student details copied to clipboard.");
  } catch (err) {
    console.error("Clipboard error:", err);
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand("copy");
    showNotification("Student details copied to clipboard.");
  } catch (err) {
    console.error("Fallback copy failed:", err);
    showNotification("Failed to copy to clipboard.");
  } finally {
    document.body.removeChild(textarea);
  }
}

// ===============================
// Print Functionality
// ===============================
function handlePrint() {
  if (!currentStudent) {
    showNotification("Please load a student by index before printing.");
    return;
  }

  const detailsHTML = $("#details").innerHTML;
  const marksHTML = $(".marks-info").innerHTML;

  let content = "";
  
  if (settings.printPref === "details") {
    content = `<h2>Student Information</h2><div id="details">${detailsHTML}</div>`;
  } else if (settings.printPref === "marks") {
    content = `<h2>Exam Results</h2>${marksHTML}`;
  } else {
    content = `
      <h2>Student Information</h2>
      <div id="details">${detailsHTML}</div>
      <h2>Exam Results</h2>
      ${marksHTML}
    `;
  }

  const printWindow = window.open("", "", "width=800,height=600");
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Student Report - ${currentStudent.name}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #000;
            background: #fff;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          #details p {
            margin: 8px 0;
            font-size: 16px;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th, td {
            border: 1px solid #333;
            padding: 10px 14px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: 600;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// ===============================
// Settings Management
// ===============================
function openSettingsModal() {
  const form = $("#settings-form");
  
  // Populate form with current settings
  form.theme.value = settings.theme;
  form.fontSize.value = String(settings.fontSize);
  form.density.value = settings.density;
  form.language.value = settings.language;
  form.animations.checked = settings.animations;
  form.timeout.value = String(settings.timeout);
  form.hideDob.checked = settings.hideDob;
  form.printPref.value = settings.printPref;
  form.notifications.checked = settings.notifications;
  form.autosave.checked = settings.autosave;
  form.debug.checked = settings.debug;

  openModal("#modal-settings");
}

function handleApplySettings() {
  const form = $("#settings-form");
  
  settings.theme = form.theme.value;
  settings.fontSize = Number(form.fontSize.value);
  settings.density = form.density.value;
  settings.language = form.language.value;
  settings.animations = form.animations.checked;
  settings.timeout = Number(form.timeout.value);
  settings.hideDob = form.hideDob.checked;
  settings.printPref = form.printPref.value;
  settings.notifications = form.notifications.checked;
  settings.autosave = form.autosave.checked;
  settings.debug = form.debug.checked;

  saveToStorage("settings", settings);
  applySettings();
  
  // Re-render current student to apply hideDob setting
  if (currentStudent) {
    renderDetails(currentStudent);
  }
  
  showNotification("Settings applied successfully.");
}

// ===============================
// Data Management
// ===============================
function exportJSON() {
  const dataStr = JSON.stringify(students, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `students_${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  showNotification("Data exported successfully.");
}

async function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error("Invalid format: expected array of students");
    }

    students = data;
    saveToStorage("students", students);
    showNotification("Data imported successfully.");
    
    // Reset current student view
    currentStudent = null;
    renderDetails(null);
    renderMarks(null);
  } catch (err) {
    console.error("Import error:", err);
    showNotification("Failed to import JSON. Please check the file format.");
  } finally {
    e.target.value = "";
  }
}

function backupSnapshot() {
  settings.snapshot = JSON.stringify(students);
  saveToStorage("settings", settings);
  showNotification("Snapshot saved successfully.");
}

function restoreSnapshot() {
  if (!settings.snapshot) {
    showNotification("No snapshot available to restore.");
    return;
  }

  try {
    students = JSON.parse(settings.snapshot);
    saveToStorage("students", students);
    showNotification("Snapshot restored successfully.");
    
    // Reset current student view
    currentStudent = null;
    renderDetails(null);
    renderMarks(null);
  } catch (err) {
    console.error("Restore error:", err);
    showNotification("Failed to restore snapshot.");
  }
}

function resetData() {
  if (!confirm("Reset to default students? This will overwrite all current data.")) {
    return;
  }

  students = structuredClone(DEFAULT_STUDENTS);
  saveToStorage("students", students);
  
  currentStudent = null;
  renderDetails(null);
  renderMarks(null);
  
  showNotification("Data reset to defaults.");
}

// ===============================
// Event Listeners
// ===============================
function initializeEventListeners() {
  // Navigation buttons
  $(".btn-new-admission").addEventListener("click", () => openModal("#modal-admission"));
  $(".btn-share").addEventListener("click", handleShare);
  $(".btn-settings").addEventListener("click", openSettingsModal);

  // Search
  $(".btn-submit").addEventListener("click", handleSearch);
  $("#search-index").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Action buttons
  $(".btn-edit").addEventListener("click", openEditModal);
  $(".btn-report").addEventListener("click", openReportModal);
  $(".btn-print").addEventListener("click", handlePrint);

  // Forms
  $("#admission-form").addEventListener("submit", handleNewAdmission);
  $("#edit-form").addEventListener("submit", handleEditStudent);
  $("#report-form").addEventListener("submit", handleReportSubmit);

  // Settings
  $("#apply-settings").addEventListener("click", handleApplySettings);
  $("#export-json").addEventListener("click", exportJSON);
  $("#import-json").addEventListener("change", importJSON);
  $("#backup-data").addEventListener("click", backupSnapshot);
  $("#restore-data").addEventListener("click", restoreSnapshot);
  $("#reset-data").addEventListener("click", resetData);

  // Report stars
  $("#modal-report").addEventListener("click", handleStarClick);

  // Modal close handlers
  $$("[data-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => closeModal(e.target));
  });

  // Close modal on background click
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = $(".modal.show");
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

// ===============================
// Initialization
// ===============================
function init() {
  applySettings();
  initializeEventListeners();
  
  if (settings.debug) {
    console.log("Application initialized");
    console.log("Students:", students);
    console.log("Settings:", settings);
  }
}

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}