// PayWatch Dashboard Application
class PayWatchApp {
    constructor() {
        this.data = {
            transactions: [
                {
                    id: "txn_1234567890",
                    amount: 2500,
                    currency: "INR",
                    status: "success",
                    paymentMethod: "UPI",
                    timestamp: "2025-08-15T10:30:00Z",
                    merchantId: "merchant_001",
                    customerEmail: "customer@example.com",
                    description: "Online Purchase"
                },
                {
                    id: "txn_1234567891", 
                    amount: 1200,
                    currency: "INR",
                    status: "failed",
                    paymentMethod: "Credit Card",
                    timestamp: "2025-08-15T10:28:00Z",
                    merchantId: "merchant_002",
                    customerEmail: "user@test.com",
                    description: "Subscription Payment",
                    errorCode: "insufficient_funds"
                },
                {
                    id: "txn_1234567892",
                    amount: 5000,
                    currency: "INR", 
                    status: "pending",
                    paymentMethod: "Net Banking",
                    timestamp: "2025-08-15T10:25:00Z",
                    merchantId: "merchant_003",
                    customerEmail: "buyer@gmail.com",
                    description: "Product Purchase"
                },
                {
                    id: "txn_1234567893",
                    amount: 3500,
                    currency: "INR",
                    status: "success",
                    paymentMethod: "Debit Card",
                    timestamp: "2025-08-15T10:20:00Z",
                    merchantId: "merchant_004",
                    customerEmail: "shop@example.com",
                    description: "Store Purchase"
                },
                {
                    id: "txn_1234567894",
                    amount: 850,
                    currency: "INR",
                    status: "success",
                    paymentMethod: "UPI",
                    timestamp: "2025-08-15T10:15:00Z",
                    merchantId: "merchant_005",
                    customerEmail: "buyer2@test.com",
                    description: "Mobile Recharge"
                }
            ],
            systemMetrics: {
                apiStatus: {
                    paymentAPI: "healthy",
                    webhookAPI: "healthy", 
                    refundAPI: "degraded",
                    reportingAPI: "healthy"
                },
                uptime: "99.98%",
                responseTime: "250ms",
                errorRate: "0.02%",
                transactionVolume: 15420
            },
            supportTickets: [
                {
                    id: "TKT-001",
                    title: "Payment failing for UPI transactions",
                    status: "open",
                    priority: "high",
                    customer: "merchant@store.com",
                    created: "2025-08-15T09:30:00Z",
                    description: "Multiple UPI payments are failing with error code payment_failed"
                },
                {
                    id: "TKT-002", 
                    title: "Webhook not receiving events",
                    status: "in_progress",
                    priority: "medium",
                    customer: "dev@ecommerce.com",
                    created: "2025-08-15T08:15:00Z", 
                    description: "Webhooks stopped working since yesterday evening"
                },
                {
                    id: "TKT-003",
                    title: "Refund processing delays",
                    status: "resolved",
                    priority: "low",
                    customer: "support@shop.com",
                    created: "2025-08-14T14:20:00Z",
                    description: "Customers reporting delayed refund processing"
                }
            ],
            errorCodes: [
                {
                    code: "insufficient_funds",
                    description: "The customer's account has insufficient funds",
                    solution: "Ask customer to check account balance or try different payment method"
                },
                {
                    code: "invalid_card",
                    description: "The card details provided are invalid",
                    solution: "Verify card number, expiry date, and CVV are correct"
                },
                {
                    code: "payment_timeout",
                    description: "Payment request timed out",
                    solution: "Retry the payment or check network connectivity"
                },
                {
                    code: "bank_declined",
                    description: "Transaction declined by the issuing bank",
                    solution: "Contact customer's bank or try alternative payment method"
                },
                {
                    code: "network_error",
                    description: "Network connectivity issues during payment",
                    solution: "Check internet connection and retry the transaction"
                }
            ],
            apiEndpoints: [
                {
                    name: "Create Payment",
                    method: "POST",
                    endpoint: "/v1/payments",
                    description: "Create a new payment request",
                    status: "active"
                },
                {
                    name: "Capture Payment", 
                    method: "POST",
                    endpoint: "/v1/payments/{id}/capture",
                    description: "Capture an authorized payment",
                    status: "active"
                },
                {
                    name: "Refund Payment",
                    method: "POST", 
                    endpoint: "/v1/refunds",
                    description: "Refund a captured payment",
                    status: "maintenance"
                },
                {
                    name: "Get Payment Details",
                    method: "GET",
                    endpoint: "/v1/payments/{id}",
                    description: "Retrieve payment details",
                    status: "active"
                }
            ]
        };
        
        this.charts = {};
        this.filters = {
            status: '',
            method: '',
            search: '',
            ticketStatus: '',
            ticketPriority: ''
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.renderDashboard();
        this.startLiveUpdates();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active classes
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const sectionId = link.dataset.section + '-section';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                    this.updatePageTitle(link.textContent.trim());
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        this.renderSection(link.dataset.section);
                    }, 50);
                }
            });
        });
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Transaction filters
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderTransactions();
            });
        }

        const methodFilter = document.getElementById('method-filter');
        if (methodFilter) {
            methodFilter.addEventListener('change', (e) => {
                this.filters.method = e.target.value;
                this.renderTransactions();
            });
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.renderTransactions();
            });
        }

        // Ticket filters
        const ticketStatusFilter = document.getElementById('ticket-status-filter');
        if (ticketStatusFilter) {
            ticketStatusFilter.addEventListener('change', (e) => {
                this.filters.ticketStatus = e.target.value;
                this.renderSupportTickets();
            });
        }

        const ticketPriorityFilter = document.getElementById('ticket-priority-filter');
        if (ticketPriorityFilter) {
            ticketPriorityFilter.addEventListener('change', (e) => {
                this.filters.ticketPriority = e.target.value;
                this.renderSupportTickets();
            });
        }

        // API Console
        const testApiBtn = document.getElementById('test-api-btn');
        if (testApiBtn) {
            testApiBtn.addEventListener('click', () => {
                this.testApiEndpoint();
            });
        }

        // Export report
        const exportBtn = document.getElementById('export-report');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        // Knowledge base search
        const kbSearch = document.getElementById('kb-search');
        if (kbSearch) {
            kbSearch.addEventListener('input', (e) => {
                this.searchKnowledgeBase(e.target.value);
            });
        }
    }

    updatePageTitle(title) {
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    renderSection(sectionId) {
        console.log('Rendering section:', sectionId);
        switch(sectionId) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'live-monitor':
                this.renderTransactions();
                break;
            case 'system-health':
                this.renderSystemHealth();
                break;
            case 'troubleshooting':
                this.renderTroubleshooting();
                this.setupTroubleshootingListeners();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'support-tickets':
                this.renderSupportTickets();
                break;
            case 'api-console':
                this.renderApiConsole();
                break;
            case 'knowledge-base':
                this.renderKnowledgeBase();
                break;
        }
    }

    renderDashboard() {
        // Render both charts with a small delay to ensure canvas elements are ready
        setTimeout(() => {
            this.renderTransactionChart();
            this.renderPaymentMethodChart();
        }, 100);
    }

    renderTransactionChart() {
        const ctx = document.getElementById('transactionChart');
        if (!ctx) return;

        if (this.charts.transactionChart) {
            this.charts.transactionChart.destroy();
        }

        const hours = [];
        const volumes = [];
        
        // Generate mock hourly data for the last 24 hours
        for (let i = 23; i >= 0; i--) {
            const hour = new Date();
            hour.setHours(hour.getHours() - i);
            hours.push(hour.getHours() + ':00');
            volumes.push(Math.floor(Math.random() * 500) + 100);
        }

        this.charts.transactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Transactions',
                    data: volumes,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    renderPaymentMethodChart() {
        const ctx = document.getElementById('paymentMethodChart');
        if (!ctx) return;

        if (this.charts.paymentMethodChart) {
            this.charts.paymentMethodChart.destroy();
        }

        this.charts.paymentMethodChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['UPI', 'Credit Card', 'Net Banking', 'Debit Card', 'Wallet'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderTransactions() {
        const container = document.getElementById('transaction-list');
        if (!container) return;

        let filteredTransactions = [...this.data.transactions];

        // Apply filters
        if (this.filters.status) {
            filteredTransactions = filteredTransactions.filter(t => t.status === this.filters.status);
        }

        if (this.filters.method) {
            filteredTransactions = filteredTransactions.filter(t => t.paymentMethod === this.filters.method);
        }

        if (this.filters.search) {
            filteredTransactions = filteredTransactions.filter(t => 
                t.id.toLowerCase().includes(this.filters.search.toLowerCase())
            );
        }

        container.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-id">${transaction.id}</div>
                    <div class="transaction-details">
                        <span class="transaction-amount">₹${transaction.amount.toLocaleString()}</span>
                        <span class="transaction-method">${transaction.paymentMethod}</span>
                        <span class="status status--${transaction.status}">${this.capitalizeFirst(transaction.status)}</span>
                    </div>
                </div>
                <div class="transaction-time">
                    ${this.formatTime(transaction.timestamp)}
                </div>
            </div>
        `).join('');
    }

    renderSystemHealth() {
        const container = document.getElementById('service-status');
        if (!container) return;

        const services = Object.entries(this.data.systemMetrics.apiStatus);
        
        container.innerHTML = services.map(([service, status]) => `
            <div class="service-item">
                <div class="service-name">${this.formatServiceName(service)}</div>
                <div class="service-status">
                    <span class="status-dot ${status}"></span>
                    <span>${this.capitalizeFirst(status)}</span>
                </div>
            </div>
        `).join('');

        setTimeout(() => {
            this.renderResponseTimeChart();
        }, 100);
    }

    renderResponseTimeChart() {
        const ctx = document.getElementById('responseTimeChart');
        if (!ctx) return;

        if (this.charts.responseTimeChart) {
            this.charts.responseTimeChart.destroy();
        }

        const timeLabels = [];
        const responseTimes = [];
        
        for (let i = 11; i >= 0; i--) {
            const time = new Date();
            time.setMinutes(time.getMinutes() - (i * 5));
            timeLabels.push(time.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}));
            responseTimes.push(Math.floor(Math.random() * 200) + 200);
        }

        this.charts.responseTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Response Time (ms)',
                    data: responseTimes,
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    renderTroubleshooting() {
        const container = document.getElementById('error-codes-list');
        if (!container) return;

        container.innerHTML = this.data.errorCodes.map(error => `
            <div class="error-code-item">
                <div class="error-code">${error.code}</div>
                <div class="error-description">${error.description}</div>
                <div class="error-solution"><strong>Solution:</strong> ${error.solution}</div>
            </div>
        `).join('');
    }

    setupTroubleshootingListeners() {
        // Re-setup troubleshooting event listeners since the section was re-rendered
        const issueButtons = document.querySelectorAll('.issue-btn');
        issueButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showTroubleshootingSteps(btn.dataset.issue);
            });
        });
    }

    renderAnalytics() {
        setTimeout(() => {
            this.renderVolumeChart();
            this.renderSuccessRateChart();
        }, 100);
    }

    renderVolumeChart() {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) return;

        if (this.charts.volumeChart) {
            this.charts.volumeChart.destroy();
        }

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const volumes = [12000, 15000, 13500, 16800, 14200, 11500, 9800];

        this.charts.volumeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Transaction Volume',
                    data: volumes,
                    backgroundColor: '#B4413C',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderSuccessRateChart() {
        const ctx = document.getElementById('successRateChart');
        if (!ctx) return;

        if (this.charts.successRateChart) {
            this.charts.successRateChart.destroy();
        }

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const successRates = [99.5, 99.8, 99.2, 99.9, 99.7, 99.4, 99.6];

        this.charts.successRateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Success Rate (%)',
                    data: successRates,
                    borderColor: '#5D878F',
                    backgroundColor: 'rgba(93, 135, 143, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 98,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    renderSupportTickets() {
        const container = document.getElementById('ticket-list');
        if (!container) return;

        let filteredTickets = [...this.data.supportTickets];

        // Apply filters
        if (this.filters.ticketStatus) {
            filteredTickets = filteredTickets.filter(t => t.status === this.filters.ticketStatus);
        }

        if (this.filters.ticketPriority) {
            filteredTickets = filteredTickets.filter(t => t.priority === this.filters.ticketPriority);
        }

        container.innerHTML = filteredTickets.map(ticket => `
            <div class="ticket-item">
                <div class="ticket-header">
                    <div>
                        <h4 class="ticket-title">${ticket.title}</h4>
                        <div class="ticket-id">${ticket.id}</div>
                    </div>
                    <div class="ticket-meta">
                        <span class="status status--${ticket.status.replace('_', '-')}">${this.formatStatus(ticket.status)}</span>
                        <span class="status priority-${ticket.priority}">${this.capitalizeFirst(ticket.priority)}</span>
                    </div>
                </div>
                <div class="ticket-description">${ticket.description}</div>
                <div class="ticket-footer">
                    <span>Customer: ${ticket.customer}</span>
                    <span>Created: ${this.formatDate(ticket.created)}</span>
                </div>
            </div>
        `).join('');
    }

    renderApiConsole() {
        const select = document.getElementById('api-endpoint');
        if (!select) return;

        select.innerHTML = '<option value="">Select an endpoint</option>' + 
            this.data.apiEndpoints.map(endpoint => `
                <option value="${endpoint.endpoint}" data-method="${endpoint.method}" data-description="${endpoint.description}">
                    ${endpoint.method} ${endpoint.endpoint} - ${endpoint.name}
                </option>
            `).join('');
    }

    renderKnowledgeBase() {
        const container = document.getElementById('knowledge-items');
        if (!container) return;

        const knowledgeItems = [
            {
                title: "Payment Failed - Insufficient Funds",
                description: "Common issue when customer doesn't have enough balance in their account. Guide them to check balance or try another payment method."
            },
            {
                title: "Webhook Timeout Issues",
                description: "How to handle webhook delivery failures and implement retry mechanisms. Check endpoint accessibility and response times."
            },
            {
                title: "Card Authentication Failed",
                description: "Steps to troubleshoot 3D Secure authentication failures. Verify card details and bank communication."
            },
            {
                title: "Integration Best Practices",
                description: "Key guidelines for successful payment gateway integration including error handling and security measures."
            },
            {
                title: "Refund Processing Delays",
                description: "Understanding refund processing timelines and how to communicate delays to customers effectively."
            }
        ];

        container.innerHTML = knowledgeItems.map(item => `
            <div class="knowledge-item">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    showTroubleshootingSteps(issueType) {
        const content = document.getElementById('wizard-content');
        if (!content) return;

        const steps = {
            'payment-failure': [
                '1. Check the error code in the transaction details',
                '2. Verify customer payment method details',
                '3. Check if the merchant account has sufficient limits',
                '4. Review bank/payment gateway responses',
                '5. Test with a different payment method'
            ],
            'webhook-issues': [
                '1. Verify webhook endpoint is accessible',
                '2. Check webhook URL configuration',
                '3. Validate webhook signature verification',
                '4. Review server logs for errors',
                '5. Test webhook endpoint manually'
            ],
            'integration-problems': [
                '1. Verify API key and secret',
                '2. Check API endpoint URLs',
                '3. Validate request format and parameters',
                '4. Review API response codes',
                '5. Check network connectivity and timeouts'
            ]
        };

        const stepsList = steps[issueType] || ['No steps available for this issue type.'];
        content.innerHTML = `
            <h4>Troubleshooting Steps for ${issueType.replace('-', ' ').toUpperCase()}</h4>
            <ol>
                ${stepsList.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
    }

    testApiEndpoint() {
        const endpoint = document.getElementById('api-endpoint').value;
        const requestBody = document.getElementById('api-request-body').value;
        const responseContent = document.getElementById('api-response-content');

        if (!endpoint) {
            responseContent.textContent = 'Please select an endpoint first.';
            return;
        }

        // Show loading state
        responseContent.textContent = 'Testing API endpoint...';

        // Simulate API response with delay
        setTimeout(() => {
            const mockResponses = {
                '/v1/payments': {
                    id: 'pay_' + Math.random().toString(36).substr(2, 9),
                    amount: 1000,
                    currency: 'INR',
                    status: 'created',
                    created_at: new Date().toISOString(),
                    method: 'upi'
                },
                '/v1/payments/{id}/capture': {
                    id: 'pay_' + Math.random().toString(36).substr(2, 9),
                    amount: 1000,
                    status: 'captured',
                    captured_at: new Date().toISOString()
                },
                '/v1/refunds': {
                    id: 'rfnd_' + Math.random().toString(36).substr(2, 9),
                    amount: 1000,
                    status: 'processed',
                    created_at: new Date().toISOString()
                },
                '/v1/payments/{id}': {
                    id: 'pay_' + Math.random().toString(36).substr(2, 9),
                    amount: 2500,
                    currency: 'INR',
                    status: 'captured',
                    method: 'card',
                    created_at: new Date().toISOString()
                }
            };

            const response = mockResponses[endpoint] || { 
                error: 'Endpoint not found',
                message: 'The requested API endpoint is not available'
            };
            
            responseContent.textContent = JSON.stringify(response, null, 2);
        }, 1000);
    }

    exportReport() {
        const reportData = {
            generated_at: new Date().toISOString(),
            transaction_volume: this.data.systemMetrics.transactionVolume,
            success_rate: '99.98%',
            response_time: this.data.systemMetrics.responseTime,
            error_rate: this.data.systemMetrics.errorRate,
            active_issues: this.data.supportTickets.filter(t => t.status !== 'resolved').length,
            system_status: 'operational',
            top_payment_methods: ['UPI (45%)', 'Credit Card (25%)', 'Net Banking (15%)'],
            recent_transactions: this.data.transactions.slice(0, 5)
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paywatch-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        alert('Report exported successfully!');
    }

    searchKnowledgeBase(query) {
        const items = document.querySelectorAll('.knowledge-item');
        
        items.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (title.includes(searchQuery) || description.includes(searchQuery)) {
                item.style.display = 'block';
            } else {
                item.style.display = query ? 'none' : 'block';
            }
        });
    }

    refreshData() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (!refreshBtn) return;
        
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            
            // Simulate fresh data
            this.data.systemMetrics.transactionVolume += Math.floor(Math.random() * 50);
            
            // Re-render current section
            const activeNav = document.querySelector('.nav-link.active');
            if (activeNav) {
                this.renderSection(activeNav.dataset.section);
            }
        }, 1000);
    }

    startLiveUpdates() {
        // Simulate live transaction updates every 15 seconds
        setInterval(() => {
            if (document.querySelector('.nav-link.active')?.dataset.section === 'live-monitor') {
                this.addRandomTransaction();
            }
        }, 15000);
    }

    addRandomTransaction() {
        const methods = ['UPI', 'Credit Card', 'Net Banking', 'Debit Card'];
        const statuses = ['success', 'failed', 'pending'];
        const descriptions = ['Online Purchase', 'Bill Payment', 'Mobile Recharge', 'Subscription', 'Food Order'];
        
        const newTransaction = {
            id: 'txn_' + Math.random().toString(36).substr(2, 10),
            amount: Math.floor(Math.random() * 5000) + 100,
            currency: 'INR',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            paymentMethod: methods[Math.floor(Math.random() * methods.length)],
            timestamp: new Date().toISOString(),
            merchantId: 'merchant_' + Math.floor(Math.random() * 100).toString().padStart(3, '0'),
            customerEmail: 'customer' + Math.floor(Math.random() * 1000) + '@example.com',
            description: descriptions[Math.floor(Math.random() * descriptions.length)]
        };

        this.data.transactions.unshift(newTransaction);
        
        // Keep only last 20 transactions
        if (this.data.transactions.length > 20) {
            this.data.transactions = this.data.transactions.slice(0, 20);
        }

        this.renderTransactions();
    }

    // Utility functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatServiceName(serviceName) {
        return serviceName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    formatStatus(status) {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PayWatchApp();
});