# Student Dashboard App

A responsive, premium-feel student dashboard web application built with **HTML, CSS, and JavaScript**.  
It allows you to manage student information, view exam results, print reports, add new admissions, edit existing records, submit performance reports, share details, and customize the app through an advanced settings panel.

---

## 🚀 Features

- **Search by Index**: Enter a student index to instantly load their details and marks.
- **Dynamic Marks Table**: Displays subject-wise marks for each student.
- **Print Reports**: Print only the student’s information and exam results (not the entire page).
- **New Admission**: Add a new student via a form (index, name, DOB, address, age, marks).
- **Edit Student**: Update details and marks of the currently loaded student.
- **Report & Rating**: Submit a performance report with a 6-star rating and comments.
- **Share**: Copy student details and marks to clipboard for easy sharing.
- **Settings Control Center**:
  - Theme toggle (Dark / Light)
  - Font size adjustment
  - Layout density (Comfortable / Compact)
  - Language selection
  - Animations toggle
  - Data management (Export, Import, Backup, Restore, Reset)
  - Privacy (Hide DOB, session timeout)
  - Functional (Print preferences, notifications, autosave)
  - Advanced (Debug mode, version info)

---

---

## ⚙️ Setup

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. That’s it — no build tools required. Pure HTML/CSS/JS.

---

## 🖥️ Usage Guide

### 1. Search Student
- Enter the **index number** in the input field.
- Click **Submit**.
- The student’s details and marks will appear.

### 2. Print Report
- Load a student first.
- Click **Print**.
- A clean report with only details + marks will be printed.

### 3. New Admission
- Click **New Admission** in the navbar.
- Fill out the form (index, name, DOB, address, age, marks).
- Submit to add the student to the system.

### 4. Edit Student
- Load a student by index.
- Click **Edit**.
- Update details/marks in the form.
- Save changes.

### 5. Report & Rating
- Load a student.
- Click **Report**.
- Select a star rating (1–6).
- Add comments.
- Submit to save the report.

### 6. Share
- Load a student.
- Click **Share**.
- Student details + marks are copied to clipboard.

### 7. Settings
- Click **Settings** in the navbar.
- Adjust appearance, data, privacy, functional, and advanced options.
- Scroll inside the modal to see all options.
- Click **Apply** to save changes.

---

## 🎨 Themes

- **Dark Mode**: Default, premium dark UI.
- **Light Mode**: Clean, modern light UI with soft backgrounds and gold accents.

---

## 📱 Responsiveness

- Works on desktop and mobile.
- Layout adapts with flexbox.
- Settings modal scrolls if content exceeds screen height.

---

## 🔒 Data Persistence

- Student records and settings are stored in **localStorage**.
- Data remains available across sessions.
- Export/Import JSON for backup and restore.

---

## 🛠️ Technologies

- **HTML5** — semantic structure
- **CSS3** — responsive design, theming, modals
- **JavaScript (ES6)** — dynamic rendering, event handling, localStorage

---

## 📌 Notes

- This is a front‑end only app (no backend).
- Data is stored locally in the browser.
- Resetting data will restore the default sample students.

---

## 📄 License

This project is open-source. Feel free to modify and extend it for your own use.


## 📂 Project Structure

