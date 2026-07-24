class CaregiverDashboard {
    constructor() {
        this.notifications = [];
        this.timelineActivities = [];
        this.alerts = [];
        this.riskScore = 28;
        this.testsCount = 15;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadInitialData();
        this.initCharts();
        this.startRealTimeUpdates();
        this.hideLoading();
        this.animateOnScroll();
    }

    cacheElements() {
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            notificationsBtn: document.getElementById('notificationsBtn'),
            notificationsPanel: document.getElementById('notificationsPanel'),
            notificationsList: document.getElementById('notificationsList'),
            closeNotifications: document.getElementById('closeNotifications'),
            notificationCount: document.getElementById('notificationCount'),
            riskScore: document.getElementById('riskScore'),
            testsCount: document.getElementById('testsCount'),
            lastAssessmentTime: document.getElementById('lastAssessmentTime'),
            aiInsightText: document.getElementById('aiInsightText'),
            alertList: document.getElementById('alertList'),
            timeline: document.getElementById('timeline'),
            searchInput: document.getElementById('searchInput'),
            generateReportBtn: document.getElementById('generateReportBtn'),
            modalContainer: document.getElementById('modalContainer'),
            homeBtn: document.getElementById('homeBtn'),
            menuToggle: document.getElementById('menuToggle'),
            sidebarOverlay: document.getElementById('sidebarOverlay')
        };
    }

    bindEvents() {
        // Notifications
        this.elements.notificationsBtn.addEventListener('click', () => this.toggleNotifications());
        this.elements.closeNotifications.addEventListener('click', () => this.closeNotifications());
        
        // Search
        this.elements.searchInput.addEventListener('input', (e) => this.filterTimeline(e.target.value));
        
        // Buttons
        this.elements.generateReportBtn.addEventListener('click', () => this.generateReport());
        this.elements.homeBtn.addEventListener('click', () => this.goHome());
        
        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) {
                    const modalType = card.dataset.modal;
                    this.openModal(modalType);
                }
            });
        });

        // Real-time updates
        document.getElementById('clearAlerts').addEventListener('click', () => this.clearAlerts());
        document.getElementById('addActivityBtn').addEventListener('click', () => this.addRandomActivity());
    }

    loadInitialData() {
        this.notifications = [
            { id: 1, type: 'success', title: 'Memory test completed', message: 'Score: 85%', time: '2 hours ago' },
            { id: 2, type: 'warning', title: 'Speech test missed', message: 'Scheduled for today', time: '5 hours ago' },
            { id: 3, type: 'info', title: 'Risk score updated', message: 'Improved by 3 points', time: '1 day ago' }
        ];

        this.timelineActivities = [
            { time: '8:00 AM', activity: 'Woke up', status: 'normal' },
            { time: '9:30 AM', activity: 'Memory test', status: 'completed' },
            { time: '2:00 PM', activity: 'Lunch', status: 'normal' },
            { time: '4:00 PM', activity: 'Speech test', status: 'missed' }
        ];

        this.alerts = [
            { type: 'info', title: 'Memory test completed', message: 'Score: 85%', time: '2 hours ago' },
            { type: 'warning', title: 'Missed speech analysis', message: 'Test scheduled today', time: '5 hours ago' },
            { type: 'success', title: 'Risk score improved', message: 'Up by 3 points', time: '1 day ago' }
        ];

        this.renderNotifications();
        this.renderAlerts();
        this.renderTimeline();
        this.updateStats();
    }

    initCharts() {
        this.initPerformanceChart();
        this.initActivityChart();
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5'],
                datasets: [{
                    label: 'Cognitive Score',
                    data: [85, 82, 84, 80, 83, 81],
                    borderColor: '#7c73e6',
                    backgroundColor: 'rgba(124, 115, 230, 0.1)',
                    tension: 0.4,
                    pointRadius: 8,
                    pointHoverRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 75, max: 90, grid: { color: 'rgba(212, 210, 232, 0.3)' } }
                }
            }
        });
    }

    initActivityChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Memory Test', 'Speech Test', 'Pattern Test', 'Story Quiz'],
                datasets: [{
                    data: [90, 75, 85, 60],
                    background: (ctx) => {
                        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                        gradient.addColorStop(0, '#7c73e6');
                        gradient.addColorStop(1, '#a8a6d3');
                        return gradient;
                    },
                    borderRadius: 12
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }

    renderNotifications() {
        this.elements.notificationsList.innerHTML = this.notifications.map(notif => `
            <div class="alert-item ${notif.type}-alert new-alert">
                <div class="alert-icon">
                    <i class="fas fa-${notif.type === 'success' ? 'check-circle' : 
                               notif.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="alert-content">
                    <p>${notif.title}</p>
                    <span>${notif.message} • ${notif.time}</span>
                </div>
            </div>
        `).join('');
        this.elements.notificationCount.textContent = this.notifications.length;
    }

    renderAlerts() {
        this.elements.alertList.innerHTML = this.alerts.map(alert => `
            <div class="alert-item ${alert.type}-alert">
                <div class="alert-icon">
                    <i class="fas fa-${alert.type === 'success' ? 'check-circle' : 
                               alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="alert-content">
                    <p>${alert.title}</p>
                    <span>${alert.message} • ${alert.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderTimeline() {
        this.elements.timeline.innerHTML = this.timelineActivities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-time">${activity.time}</div>
                <div class="timeline-line"></div>
                <div class="timeline-content">
                    <span>${activity.activity}</span>
                    <div class="status-badge ${activity.status}">${activity.status}</div>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        this.elements.riskScore.textContent = `${this.riskScore} / 100`;
        this.elements.testsCount.textContent = this.testsCount;
        this.elements.lastAssessmentTime.textContent = this.getTimeAgo();
    }

    toggleNotifications() {
        this.elements.notificationsPanel.classList.toggle('active');
    }

    closeNotifications() {
        this.elements.notificationsPanel.classList.remove('active');
    }

    filterTimeline(query) {
        const filtered = this.timelineActivities.filter(activity => 
            activity.activity.toLowerCase().includes(query.toLowerCase())
        );
        // Re-render filtered timeline
        this.elements.timeline.innerHTML = filtered.map(activity => `
            <div class="timeline-item">
                <div class="timeline-time">${activity.time}</div>
                <div class="timeline-line"></div>
                <div class="timeline-content">
                    <span>${activity.activity}</span>
                    <div class="status-badge ${activity.status}">${activity.status}</div>
                </div>
            </div>
        `).join('');
    }

    generateReport() {
        // Simulate report generation
        this.showToast('Report is being generated...', 'info');
        setTimeout(() => {
            this.downloadReport();
            this.showToast('Report downloaded successfully!', 'success');
        }, 2000);
    }

    downloadReport() {
        const report = `
Caregiver Report - John Smith
Generated: ${new Date().toLocaleString()}
Risk Score: ${this.riskScore}/100
Tests Completed: ${this.testsCount}
        `;
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `caregiver-report-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    openModal(type) {
        const modals = {
            reminders: `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Set Reminders</h3>
                        <button class="close-btn" onclick="dashboard.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="form-group">
                            <label>Medication Time</label>
                            <input type="time" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Appointment</label>
                            <input type="date" class="form-input">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary" onclick="dashboard.closeModal()">Cancel</button>
                        <button class="btn primary">Save Reminder</button>
                    </div>
                </div>
            `,
            alerts: `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Alert Settings</h3>
                        <button class="close-btn" onclick="dashboard.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" checked> Email notifications
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox"> SMS alerts
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary" onclick="dashboard.closeModal()">Cancel</button>
                        <button class="btn primary">Save Settings</button>
                    </div>
                </div>
            `,
            history: `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Assessment History</h3>
                        <button class="close-btn" onclick="dashboard.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="history-item">
                            <span>Memory Test - 85%</span>
                            <small>2 hours ago</small>
                        </div>
                        <div class="history-item">
                            <span>Speech Test - 78%</span>
                            <small>1 day ago</small>
                        </div>
                    </div>
                </div>
            `
        };
        
        this.elements.modalContainer.innerHTML = modals[type];
        this.elements.modalContainer.classList.add('active');
    }

    closeModal() {
        this.elements.modalContainer.classList.remove('active');
    }

    clearAlerts() {
        this.alerts = [];
        this.renderAlerts();
        this.showToast('All alerts cleared!', 'success');
    }

    addRandomActivity() {
        const activities = ['Medication taken', 'Walk completed', 'Pattern test', 'Story quiz'];
        const statuses = ['normal', 'completed', 'missed'];
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        
        const newActivity = {
            time,
            activity: activities[Math.floor(Math.random() * activities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        };
        
        this.timelineActivities.unshift(newActivity);
        this.renderTimeline();
        this.showToast('Activity added!', 'success');
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.riskScore = Math.max(20, Math.min(95, this.riskScore + (Math.random() - 0.5) * 4));
                this.updateStats();
            }
            
            if (Math.random() > 0.8) {
                this.testsCount = Math.max(10, this.testsCount + Math.floor(Math.random() * 3));
                document.querySelector('.progress-fill').style.width = `${Math.min(95, this.testsCount * 5)}%`;
                this.elements.testsCount.textContent = this.testsCount;
            }
        }, 10000);

        // Add new notifications occasionally
        setInterval(() => {
            if (Math.random() > 0.85 && this.notifications.length < 10) {
                const newNotif = {
                    id: Date.now(),
                    type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)],
                    title: 'New update',
                    message: 'System activity detected',
                    time: 'Just now'
                };
                this.notifications.unshift(newNotif);
                this.renderNotifications();
            }
        }, 15000);
    }

    getTimeAgo() {
        const times = ['2 hours ago', '45 minutes ago', '1 hour ago'];
        return times[Math.floor(Math.random() * times.length)];
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.4s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    hideLoading() {
        setTimeout(() => {
            this.elements.loadingScreen.style.opacity = '0';
            setTimeout(() => this.elements.loadingScreen.remove(), 500);
        }, 1500);
    }

    goHome() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast('Welcome back to dashboard!', 'success');
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.stat-card, .chart-card, .action-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// Global dashboard instance
const dashboard = new CaregiverDashboard();

// Add global modal close functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-container')) {
        dashboard.closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        dashboard.closeNotifications();
        dashboard.closeModal();
    }
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        dashboard.elements.notificationsBtn.click();
    }
});

// PWA-like functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}