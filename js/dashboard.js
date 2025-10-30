// Dashboard JavaScript for Portal (Demo Version)

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (basic check)
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'portal-login.html';
        return;
    }

    // Initialize dashboard components
    initDashboard();
    loadDashboardData();
    setupEventListeners();
});

function initDashboard() {
    // Set user welcome message
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userWelcome.textContent = `Welcome, ${userData.name || 'User'}!`;
    }

    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initCharts();
    }

    // Initialize date pickers
    initDatePickers();
}

function loadDashboardData() {
    // Simulate loading data
    showLoading('Loading dashboard data...');
    
    setTimeout(() => {
        // Sample data - in real implementation, this would come from an API
        const sampleData = {
            attendance: '95%',
            pendingAssignments: 3,
            upcomingEvents: 5,
            unreadMessages: 2
        };
        
        updateDashboardWidgets(sampleData);
        hideLoading();
    }, 1500);
}

function updateDashboardWidgets(data) {
    // Update various dashboard widgets with data
    const widgets = {
        'attendanceWidget': data.attendance,
        'assignmentsWidget': data.pendingAssignments,
        'eventsWidget': data.upcomingEvents,
        'messagesWidget': data.unreadMessages
    };
    
    Object.keys(widgets).forEach(widgetId => {
        const element = document.getElementById(widgetId);
        if (element) {
            element.textContent = widgets[widgetId];
        }
    });
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                window.location.href = 'portal-login.html';
            }
        });
    }

    // Quick action buttons
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.dataset.action;
            handleQuickAction(actionType);
        });
    });

    // Notification bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', toggleNotifications);
    }
}

function handleQuickAction(action) {
    const actions = {
        'view-schedule': () => showMessage('Opening schedule...', 'info'),
        'submit-assignment': () => showMessage('Redirecting to assignments...', 'info'),
        'check-grades': () => showMessage('Loading grade report...', 'info'),
        'contact-teacher': () => showMessage('Opening messaging...', 'info')
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

function toggleNotifications() {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.toggle('active');
    }
}

function initCharts() {
    // Sample attendance chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Attendance %',
                    data: [92, 95, 94, 96, 93, 95],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Sample performance chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['Math', 'Science', 'English', 'History', 'Computer'],
                datasets: [{
                    label: 'Marks',
                    data: [85, 92, 78, 88, 95],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(230, 126, 34, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function initDatePickers() {
    // Initialize any date pickers in the dashboard
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set min date to today
        input.min = new Date().toISOString().split('T')[0];
    });
}

function showLoading(message = 'Loading...') {
    // Create or show loading indicator
    let loading = document.getElementById('loadingIndicator');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loadingIndicator';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const spinner = loading.querySelector('.loading-spinner');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        `;
        
        document.body.appendChild(loading);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    loading.style.display = 'flex';
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Utility function for making API calls
async function makeAPICall(endpoint, method = 'GET', data = null) {
    showLoading('Processing...');
    
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`/api/${endpoint}`, options);
        const result = await response.json();
        
        hideLoading();
        
        if (!response.ok) {
            throw new Error(result.message || 'API call failed');
        }
        
        return result;
    } catch (error) {
        hideLoading();
        showMessage(error.message, 'error');
        throw error;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        loadDashboardData,
        makeAPICall,
        showLoading,
        hideLoading
    };
}