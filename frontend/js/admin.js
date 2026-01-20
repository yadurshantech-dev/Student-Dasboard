document.addEventListener('DOMContentLoaded', () => {
    // --- State & Selectors ---
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('loginForm');
    const studentsGrid = document.getElementById('studentsGrid');
    const modal = document.getElementById('studentModal');
    const studentForm = document.getElementById('studentForm');
    const marksModal = document.getElementById('marksModal');
    const marksList = document.getElementById('marksList');

    // Auth State
    let adminToken = localStorage.getItem('adminToken');

    // --- Init ---
    if (adminToken) {
        showDashboard();
    }

    // --- Auth Logic ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mobile = document.getElementById('mobile').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password })
            });
            const data = await res.json();

            if (res.ok) {
                adminToken = data.token;
                localStorage.setItem('adminToken', adminToken);
                showToast('Login Successful!', 'success');
                showDashboard();
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (err) {
            showToast('Network error', 'error');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        location.reload();
    });

    function showDashboard() {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchStudents();
    }

    // --- Student CRUD ---
    let currentStudents = [];

    async function fetchStudents() {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/admin/students`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            currentStudents = await res.json();

            studentsGrid.innerHTML = '';

            if (currentStudents.length === 0) {
                studentsGrid.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1;">No students found.</p>';
                return;
            }

            currentStudents.forEach(student => {
                const card = createStudentCard(student);
                studentsGrid.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            showToast('Error loading students', 'error');
        }
    }

    function createStudentCard(student) {
        const div = document.createElement('div');
        div.className = 'glass-card fade-in';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h3 class="font-bold text-xl">${student.name}</h3>
                    <p class="text-muted text-sm">${student.index}</p>
                </div>
                <span class="${student.feeStatus === 'PAID' ? 'badge-paid' : 'badge-unpaid'} cursor-pointer" onclick="toggleFee('${student._id}', '${student.feeStatus}')">
                    ${student.feeStatus}
                </span>
            </div>
            <div class="mb-4 text-sm text-muted">
                <p>School: ${student.school}</p>
                <p>Grade: ${student.grade} | ${student.examType}</p>
            </div>
            <p class="text-sm mb-4" style="font-style: italic; color: #cbd5e1;">${student.description || 'No notes.'}</p>
            <div class="flex justify-between mt-auto">
                <button class="btn btn-secondary" onclick="viewMarks('${student._id}')" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Explore Marks</button>
                <div class="flex gap-2">
                    <button class="btn btn-secondary" onclick="openEditModal('${student._id}')" style="padding: 0.5rem; border-color: #64748b; color: #64748b;">✏️</button>
                    <button class="btn btn-danger" onclick="deleteStudent('${student._id}')" style="padding: 0.5rem;">🗑️</button>
                </div>
            </div>
        `;
        return div;
    }

    // Global Functions for onclick accessibility
    window.toggleFee = async (id, currentStatus) => {
        const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
        if (!confirm(`Change fee status to ${newStatus}?`)) return;

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/admin/students/${id}/fee`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ feeStatus: newStatus })
            });

            if (res.ok) {
                showToast('Fee status updated', 'success');
                fetchStudents();
            } else {
                showToast('Failed to update fee', 'error');
            }
        } catch (error) {
            showToast('Error updating fee', 'error');
        }
    };

    window.deleteStudent = async (id) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/admin/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (res.ok) {
                showToast('Student deleted', 'success');
                fetchStudents();
            }
        } catch (e) {
            showToast('Error deleting student', 'error');
        }
    };

    // --- Modal Handling ---
    const addBtn = document.getElementById('addStudentBtn');
    const closeModal = document.getElementById('closeModal');
    let isEditMode = false;

    addBtn.addEventListener('click', () => {
        isEditMode = false;
        document.getElementById('modalTitle').innerText = 'Add Student';
        studentForm.reset();
        document.getElementById('studentId').value = '';
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('closeMarksModal').addEventListener('click', () => {
        marksModal.style.display = 'none';
    });

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('studentId').value;
        const sData = {
            index: document.getElementById('sIdx').value,
            name: document.getElementById('sName').value,
            school: document.getElementById('sSchool').value,
            badge: document.getElementById('sBadge').value,
            grade: document.getElementById('sGrade').value,
            examType: document.getElementById('sExamType').value,
            description: document.getElementById('sDesc').value
        };

        const url = isEditMode ? `${CONFIG.API_BASE_URL}/admin/students/${id}` : `${CONFIG.API_BASE_URL}/admin/students`;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(sData)
            });

            if (res.ok) {
                showToast(`Student ${isEditMode ? 'updated' : 'added'}`, 'success');
                modal.style.display = 'none';
                fetchStudents();
            } else {
                const d = await res.json();
                showToast(d.message || 'Error', 'error');
            }
        } catch (error) {
            showToast('Request failed', 'error');
        }
    });

    window.openEditModal = (id) => {
        const s = currentStudents.find(st => st._id === id);
        if (!s) return;

        isEditMode = true;
        document.getElementById('modalTitle').innerText = 'Edit Student';
        document.getElementById('studentId').value = s._id;
        document.getElementById('sIdx').value = s.index;
        document.getElementById('sName').value = s.name;
        document.getElementById('sSchool').value = s.school;
        document.getElementById('sBadge').value = s.badge;
        document.getElementById('sGrade').value = s.grade;
        document.getElementById('sExamType').value = s.examType;
        document.getElementById('sDesc').value = s.description;

        modal.style.display = 'flex';
    };

    // --- Marks Management ---
    let marksStudentId = null;

    window.viewMarks = (id) => {
        marksStudentId = id;
        const s = currentStudents.find(st => st._id === id);
        if (!s) return;

        renderMarksList(s.marks);
        marksModal.style.display = 'flex';
    };

    function renderMarksList(marks) {
        marksList.innerHTML = '';
        if (marks && marks.length > 0) {
            marks.forEach(m => {
                const row = document.createElement('div');
                row.className = 'glass-card mb-2 p-2 flex justify-between';
                row.innerHTML = `
                    <div>
                        <span class="font-bold block">${m.subject}</span>
                        <span class="text-xs text-muted">${m.term}</span>
                    </div>
                    <span class="font-bold text-lg">${m.score}</span>
                `;
                marksList.appendChild(row);
            });
        } else {
            marksList.innerHTML = '<p class="text-muted">No marks data available.</p>';
        }
    }

    document.getElementById('addMarkBtn').addEventListener('click', async () => {
        const subject = document.getElementById('mSubject').value;
        const term = document.getElementById('mTerm').value;
        const score = document.getElementById('mScore').value;

        if (!subject || !term || !score) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/admin/students/${marksStudentId}/marks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ subject, term, score })
            });

            if (res.ok) {
                const updatedMarks = await res.json();

                // Update local state
                const s = currentStudents.find(st => st._id === marksStudentId);
                if (s) s.marks = updatedMarks;

                renderMarksList(updatedMarks);
                showToast('Mark added successfully', 'success');

                // Clear inputs
                document.getElementById('mSubject').value = '';
                document.getElementById('mTerm').value = '';
                document.getElementById('mScore').value = '';
            } else {
                showToast('Failed to add mark', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error adding mark', 'error');
        }
    });

    // --- Toast Utility ---
    function showToast(msg, type = 'success') {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.borderLeft = type === 'success' ? '4px solid #10b981' : '4px solid #ef4444';
        t.classList.add('toast-visible');
        setTimeout(() => t.classList.remove('toast-visible'), 3000);
    }
});
