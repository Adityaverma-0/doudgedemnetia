// Enhanced Sample patient data with more realistic metrics
const patients = [
    {
        id: 1,
        name: "Margaret Johnson",
        avatar: "MJ",
        age: 68,
        riskScore: 72,
        riskLevel: "high",
        lastTestDate: "3 days ago",
        lastTestType: "Memory Recall",
        totalAssessments: 14,
        avgScore: 78.4,
        radarData: [85, 62, 78, 55, 68, 71],
        lineData: [65, 68, 70, 67, 72, 75],
        assessments: [
            { name: "Memory Recall Test", score: "92%", date: "3 days ago", badge: "excellent" },
            { name: "Speech Analysis", score: "78%", date: "5 days ago", badge: "good" },
            { name: "Pattern Recognition", score: "85%", date: "7 days ago", badge: "excellent" },
            { name: "Attention Test", score: "68%", date: "10 days ago", badge: "good" },
            { name: "Problem Solving", score: "72%", date: "14 days ago", badge: "good" }
        ]
    },
    {
        id: 2,
        name: "Robert Chen",
        avatar: "RC",
        age: 74,
        riskScore: 45,
        riskLevel: "moderate",
        lastTestDate: "5 days ago",
        lastTestType: "Speech Analysis",
        totalAssessments: 18,
        avgScore: 82.7,
        radarData: [78, 82, 65, 71, 76, 69],
        lineData: [72, 74, 73, 75, 76, 78],
        assessments: [
            { name: "Memory Recall Test", score: "88%", date: "5 days ago", badge: "excellent" },
            { name: "Speech Analysis", score: "82%", date: "8 days ago", badge: "excellent" },
            { name: "Pattern Recognition", score: "76%", date: "12 days ago", badge: "good" },
            { name: "Attention Test", score: "79%", date: "15 days ago", badge: "good" },
            { name: "Problem Solving", score: "84%", date: "18 days ago", badge: "excellent" }
        ]
    },
    {
        id: 3,
        name: "John Doe",
        avatar: "ED",
        age: 71,
        riskScore: 28,
        riskLevel: "low",
        lastTestDate: "2 days ago",
        lastTestType: "Comprehensive",
        totalAssessments: 22,
        avgScore: 91.2,
        radarData: [91, 88, 85, 82, 87, 90],
        lineData: [85, 87, 88, 89, 90, 91],
        assessments: [
            { name: "Memory Recall Test", score: "95%", date: "2 days ago", badge: "excellent" },
            { name: "Speech Analysis", score: "91%", date: "4 days ago", badge: "excellent" },
            { name: "Pattern Recognition", score: "89%", date: "6 days ago", badge: "excellent" },
            { name: "Attention Test", score: "87%", date: "9 days ago", badge: "excellent" },
            { name: "Problem Solving", score: "93%", date: "11 days ago", badge: "excellent" }
        ]
    }
];

let currentPatient = patients[0];
let radarChart = null;
let lineChart = null;
let isLoading = false;

// DOM Elements
const patientGrid = document.getElementById('patientGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const assessmentList = document.getElementById('assessmentList');
const reportGrid = document.getElementById('reportGrid');
const loadingOverlay = document.getElementById('loadingOverlay');

// Dynamic elements
const riskScoreEl = document.getElementById('riskScore');
const riskLabelEl = document.getElementById('riskLabel');
const lastTestDateEl = document.getElementById('lastTestDate');
const lastTestTypeEl = document.getElementById('lastTestType');
const totalAssessmentsEl = document.getElementById('totalAssessments');
const avgScoreEl = document.getElementById('avgScore');

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    showLoading(true);
    setTimeout(() => {
        initApp();
        showLoading(false);
    }, 1200);
});

function initApp() {
    renderPatients();
    initEventListeners();
    renderPatientData(currentPatient);
    initCharts();
    initReports();
}

function showLoading(show) {
    loadingOverlay.classList.toggle('hidden', !show);
    isLoading = show;
}

function renderPatients(filteredPatients = patients) {
    patientGrid.innerHTML = filteredPatients.map(patient => `
        <div class="patient-card ${patient.id === currentPatient.id ? 'active' : ''}" data-patient-id="${patient.id}">
            <div class="patient-avatar">${patient.avatar}</div>
            <div class="patient-name">${patient.name}</div>
            <div class="patient-meta">
                <span><i class="fas fa-calendar-alt"></i> Age ${patient.age}</span>
            </div>
            <div class="risk-display">
                <div class="risk-score">${patient.riskScore}</div>
                <div class="risk-label ${patient.riskLevel}">${patient.riskLevel.toUpperCase()}</div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.patient-card').forEach(card => {
        card.addEventListener('click', () => {
            const patientId = parseInt(card.dataset.patientId);
            selectPatient(patientId);
        });
    });
}

function selectPatient(patientId) {
    currentPatient = patients.find(p => p.id === patientId);

    document.querySelectorAll('.patient-card').forEach(card =>
        card.classList.toggle('active', parseInt(card.dataset.patientId) === patientId)
    );

    renderPatientData(currentPatient);
    updateCharts();
}

function renderPatientData(patient) {
    riskScoreEl.textContent = patient.riskScore;
    riskLabelEl.textContent = patient.riskLevel.toUpperCase();
    riskLabelEl.className = `risk-label ${patient.riskLevel}`;
    lastTestDateEl.textContent = patient.lastTestDate;
    lastTestTypeEl.textContent = patient.lastTestType;
    totalAssessmentsEl.textContent = patient.totalAssessments;
    avgScoreEl.textContent = patient.avgScore.toFixed(1);

    renderAssessments(patient.assessments);
}

function renderAssessments(assessments) {
    assessmentList.innerHTML = assessments.slice(0, 5).map(assessment => `
        <div class="assessment-row">
            <div class="assessment-name">
                <i class="fas fa-clipboard-check"></i> ${assessment.name}
            </div>
            <div style="display: flex; gap: 1.5rem; align-items: center;">
                <div class="assessment-score">${assessment.score}</div>
                <span class="assessment-badge badge-${assessment.badge}">${assessment.badge.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

function initReports() {
    reportGrid.innerHTML = `
        <div class="report-card">
            <div class="report-icon brain"><i class="fas fa-brain"></i></div>
            <div class="report-info">
                <h4>Comprehensive Cognitive Assessment</h4>
                <p>Full cognitive domain evaluation with detailed risk analysis and recommendations</p>
            </div>
            <button class="download-btn" onclick="downloadReport('comprehensive')">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
        <div class="report-card">
            <div class="report-icon risk"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="report-info">
                <h4>Risk Assessment Report</h4>
                <p>Detailed risk scoring, probability analysis and clinical recommendations</p>
            </div>
            <button class="download-btn" onclick="downloadReport('risk')">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
        <div class="report-card">
            <div class="report-icon activity"><i class="fas fa-chart-area"></i></div>
            <div class="report-info">
                <h4>Activity & Behavior Log</h4>
                <p>6-week behavioral patterns, cognitive trends and progress insights</p>
            </div>
            <button class="download-btn" onclick="downloadReport('activity')">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

function initEventListeners() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('exportBtn').addEventListener('click', exportAllReports);
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('viewAllBtn').addEventListener('click', () => {
        alert('View all assessments feature coming soon!');
    });
    document.getElementById('generateReportBtn').addEventListener('click', generateNewReport);
    document.getElementById('dismissNote').addEventListener('click', dismissNote);

    document.getElementById('patientSearch').addEventListener('input', handleSearch);
}

function switchTab(tabId) {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(query)
    );
    renderPatients(filtered);
}

function refreshData() {
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('loading');

    setTimeout(() => {
        showLoading(true);
        setTimeout(() => {
            patients.forEach(patient => {
                patient.riskScore += Math.floor(Math.random() * 3) - 1;
                patient.riskScore = Math.max(0, Math.min(100, patient.riskScore));
            });

            renderPatients();
            renderPatientData(currentPatient);
            updateCharts();
            showLoading(false);
            btn.classList.remove('loading');

            showNotification("Patient data refreshed!", "success");
        }, 1500);
    }, 300);
}

// ---------------- PDF FUNCTIONS ----------------

function getChartImage(chart) {
    try {
        return chart.toBase64Image();
    } catch (err) {
        return null;
    }
}

async function createPDF(reportType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const patient = currentPatient;

    const today = new Date().toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Clinical Cognitive Health Report", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${today}`, 20, 28);

    doc.setFont("helvetica", "bold");
    doc.text("Patient Details", 20, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${patient.name}`, 20, 48);
    doc.text(`Age: ${patient.age}`, 20, 56);
    doc.text(`Risk Score: ${patient.riskScore} (${patient.riskLevel.toUpperCase()})`, 20, 64);
    doc.text(`Last Test: ${patient.lastTestType} (${patient.lastTestDate})`, 20, 72);
    doc.text(`Total Assessments: ${patient.totalAssessments}`, 20, 80);
    doc.text(`Average Score: ${patient.avgScore.toFixed(1)}%`, 20, 88);

    doc.setFont("helvetica", "bold");
    doc.text("Recent Assessments", 20, 102);

    let y = 110;
    doc.setFont("helvetica", "normal");
    patient.assessments.forEach((a) => {
        doc.text(`${a.name} - ${a.score} (${a.date})`, 20, y);
        y += 8;
    });

    y += 5;

    // Radar chart image
    const radarImg = getChartImage(radarChart);
    if (radarImg) {
        doc.setFont("helvetica", "bold");
        doc.text("Cognitive Domain Profile", 20, y + 10);
        doc.addImage(radarImg, "PNG", 25, y + 15, 160, 90);
        y += 115;
    }

    // New page for line chart
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("6-Week Cognitive Performance Trend", 20, 20);

    const lineImg = getChartImage(lineChart);
    if (lineImg) {
        doc.addImage(lineImg, "PNG", 25, 30, 160, 90);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Clinical Recommendations:", 20, 135);

    doc.setFontSize(11);
    doc.text("- Monitor cognitive decline indicators closely.", 20, 145);
    doc.text("- Schedule follow-up assessment within 7 days.", 20, 153);
    doc.text("- Consider multidisciplinary consultation.", 20, 161);

    doc.setFontSize(9);
    doc.text("NOTE: This report is system-generated and should be reviewed by a qualified clinician.", 20, 285);

    const filename = `${patient.name.replaceAll(" ", "_")}_${reportType}_Report.pdf`;
    doc.save(filename);
}

function exportAllReports() {
    showNotification("Exporting all reports...", "info");

    setTimeout(async () => {
        try {
            await createPDF("Comprehensive");
            await createPDF("Risk");
            await createPDF("Activity");

            showNotification("All reports exported successfully!", "success");
        } catch (err) {
            console.error(err);
            showNotification("Export failed!", "error");
        }
    }, 500);
}

function downloadReport(type) {
    showNotification(`Generating ${type} report...`, "info");

    setTimeout(async () => {
        try {
            await createPDF(type);
            showNotification(`${type} report downloaded!`, "success");
        } catch (err) {
            console.error(err);
            showNotification("PDF generation failed!", "error");
        }
    }, 400);
}

function generateNewReport() {
    showNotification("Generating new report...", "info");
    setTimeout(() => {
        showNotification("New report generated successfully!", "success");
    }, 1200);
}

// ---------------- OTHER UI FUNCTIONS ----------------

function dismissNote() {
    const note = document.querySelector('.clinical-note');
    note.style.animation = 'slideOutDown 0.3s ease forwards';
    setTimeout(() => note.remove(), 300);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function initCharts() {
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Memory', 'Attention', 'Language', 'Problem Solving', 'Pattern Recognition', 'Speech Fluency'],
            datasets: [{
                label: 'Performance',
                data: currentPatient.radarData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                borderWidth: 3,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 20 }
                }
            }
        }
    });

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Cognitive Score',
                data: currentPatient.lineData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.12)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

function updateCharts() {
    if (radarChart) {
        radarChart.data.datasets[0].data = currentPatient.radarData;
        radarChart.update();
    }

    if (lineChart) {
        lineChart.data.datasets[0].data = currentPatient.lineData;
        lineChart.update();
    }
}