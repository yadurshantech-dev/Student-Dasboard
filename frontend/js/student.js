document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const studentDashboard = document.getElementById('studentDashboard');
    const paymentModal = document.getElementById('paymentModal');

    let currentStudent = null;

    document.getElementById('studentLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const index = document.getElementById('idxNumber').value;

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/student/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ index })
            });

            const data = await res.json();

            if (res.ok) {
                currentStudent = data;
                loadDashboard(data);
            } else {
                showToast(data.message || 'Student not found', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        location.reload();
    });

    function loadDashboard(data) {
        loginSection.style.display = 'none';
        studentDashboard.style.display = 'block';

        document.getElementById('welcomeName').innerText = `Welcome, ${data.name.split(' ')[0]}`;
        document.getElementById('studentInfo').innerText = `Index: ${data.index}`;

        document.getElementById('dispSchool').innerText = data.school;
        document.getElementById('dispGrade').innerText = data.grade;
        document.getElementById('dispBadge').innerText = data.badge;
        document.getElementById('dispExam').innerText = data.examType;

        // Populate optional fields
        document.getElementById('sEmail').value = data.email || '';
        document.getElementById('sAbout').value = data.aboutMe || '';

        updateFeeStatus(data.feeStatus);

        // Marks
        const marksContainer = document.getElementById('marksContainer');
        marksContainer.innerHTML = '';
        if (data.marks && data.marks.length > 0) {
            data.marks.forEach(m => {
                const el = document.createElement('div');
                el.className = 'glass-card mb-2 flex justify-between items-center';
                el.style.padding = '1rem';
                el.innerHTML = `<span>${m.subject} (${m.term})</span> <span class="font-bold text-xl">${m.score}</span>`;
                marksContainer.appendChild(el);
            });
        } else {
            marksContainer.innerHTML = '<p class="text-muted">No marks recorded yet.</p>';
        }
    }

    function updateFeeStatus(status) {
        const badge = document.getElementById('feeStatusBadge');
        const payBtn = document.getElementById('payFeeBtn');

        if (status === 'PAID') {
            badge.className = 'badge-paid mb-4';
            badge.innerText = 'PAID';
            payBtn.innerText = 'Fee Paid';
            payBtn.disabled = true;
            payBtn.style.opacity = '0.5';
            payBtn.style.cursor = 'not-allowed';
        } else {
            badge.className = 'badge-unpaid mb-4';
            badge.innerText = 'UNPAID';
            payBtn.innerText = 'Pay Fee Now';
            payBtn.disabled = false;
            payBtn.style.opacity = '1';
            payBtn.style.cursor = 'pointer';
        }
    }

    // --- Payment Flow ---
    document.getElementById('payFeeBtn').addEventListener('click', async () => {
        paymentModal.style.display = 'flex';
        document.getElementById('paymentProcessing').style.display = 'block';
        document.getElementById('paymentSuccess').style.display = 'none';
        document.getElementById('paymentError').style.display = 'none';

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/payment/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    index: currentStudent.index,
                    amount: 5000 // Mock amount
                })
            });
            const data = await res.json();

            document.getElementById('paymentProcessing').style.display = 'none';

            if (res.ok && data.success) {
                document.getElementById('paymentSuccess').style.display = 'block';
                currentStudent.feeStatus = 'PAID';
                updateFeeStatus('PAID');
            } else {
                document.getElementById('paymentError').style.display = 'block';
            }

        } catch (error) {
            document.getElementById('paymentProcessing').style.display = 'none';
            document.getElementById('paymentError').style.display = 'block';
        }
    });

    document.getElementById('closePaymentModal').addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    document.getElementById('retryPaymentBtn').addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    // --- Profile Save ---
    document.getElementById('saveProfileBtn').addEventListener('click', async () => {
        const email = document.getElementById('sEmail').value;
        const aboutMe = document.getElementById('sAbout').value;

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/student/${currentStudent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, aboutMe })
            });

            if (res.ok) {
                const updated = await res.json();
                currentStudent = updated; // Update local state
                showToast('Profile saved successfully', 'success');
            } else {
                showToast('Failed to save profile', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error saving profile', 'error');
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
