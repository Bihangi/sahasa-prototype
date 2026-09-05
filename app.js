const app = {
  state: {
    language: 'en',
    currentPage: 'dashboard',
    inventoryFilter: 'All',
    searchTerm: '',
    notificationOpen: false,
    authenticated: false,
    selectedForecast: 'Carrot'
  },
  init() {
    this.bindStaticEvents();
    this.renderNotifications();
    this.applyLanguage();
    this.renderPage();
    this.setLoginScreen(true);
  },

  bindStaticEvents() {
    document.addEventListener('click', (event) => {
      const pageBtn = event.target.closest('[data-page]');
      if (pageBtn) {
        const page = pageBtn.dataset.page;
        this.state.currentPage = page;
        this.setActiveNav();
        this.renderPage();
      }

      const langBtn = event.target.closest('[data-lang]');
      if (langBtn) {
        const lang = langBtn.dataset.lang;
        this.setLanguage(lang);
      }

      const filterBtn = event.target.closest('[data-filter]');
      if (filterBtn) {
        this.state.inventoryFilter = filterBtn.dataset.filter;
        this.renderPage();
      }

      const forecastBtn = event.target.closest('[data-veg]');
      if (forecastBtn) {
        this.state.selectedForecast = forecastBtn.dataset.veg;
        this.renderPage();
      }

      const reportBtn = event.target.closest('[data-report]');
      if (reportBtn) {
        this.showToast(t('reportGenerated'));
      }

      const detailBtn = event.target.closest('[data-detail]');
      if (detailBtn) {
        const rec = sahasaData.recommendations.find(item => item.vegetable === detailBtn.dataset.detail);
        if (rec) {
          this.openRecommendationModal(rec);
        }
      }

      const acceptBtn = event.target.closest('[data-accept]');
      if (acceptBtn) {
        this.showToast(t('recommendationAccepted'));
      }

      const stockBtn = event.target.closest('[data-record-stock]');
      if (stockBtn) {
        this.openStockModal();
      }

      const loginAction = event.target.closest('#login-btn');
      if (loginAction) {
        this.login();
      }

      const demoLoginBtn = event.target.closest('#demo-login-btn');
      if (demoLoginBtn) {
        document.getElementById('username').value = 'kasun.dec';
        document.getElementById('password').value = 'demo123';
        this.login();
      }

      const closeModal = event.target.closest('[data-close-modal]');
      if (closeModal) {
        this.closeModal();
      }

      const saveStock = event.target.closest('#save-stock-btn');
      if (saveStock) {
        this.saveStockRecord();
      }

      const saveSettings = event.target.closest('#save-settings-btn');
      if (saveSettings) {
        this.showToast(t('settingsSaved'));
      }

      const retryBtn = event.target.closest('[data-retry]');
      if (retryBtn) {
        this.showToast(t('inventoryRefreshed'));
      }

      const addSales = event.target.closest('[data-add-sales]');
      if (addSales) {
        this.showToast(t('salesAdded'));
      }

      if (event.target.closest('#notification-toggle')) {
        this.toggleNotifications();
      }

      if (!event.target.closest('.notification-panel') && !event.target.closest('#notification-toggle')) {
        this.state.notificationOpen = false;
        const panel = document.getElementById('notification-panel');
        if (panel) panel.classList.add('hidden');
      }
    });

    document.getElementById('page-content').addEventListener('input', (event) => {
      if (event.target.matches('#inventory-search')) {
        this.state.searchTerm = event.target.value.trim().toLowerCase();
        this.renderInventory();
      }
    });

    document.getElementById('page-content').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.target;
      if (form.matches('#stock-form')) {
        this.saveStockRecord();
      }
    });

    document.querySelectorAll('.lang-toggle-btn').forEach((button) => {
      button.addEventListener('click', () => this.setLanguage(button.dataset.lang));
    });

    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.addEventListener('click', () => this.setLanguage(button.dataset.lang));
    });
  },

  setLanguage(lang) {
    this.state.language = lang;
    this.applyLanguage();
    this.renderPage();
  },

  applyLanguage() {
    const dictionary = window.translations[this.state.language];
    if (!dictionary) return;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === this.state.language);
    });

    document.querySelectorAll('.lang-toggle-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === this.state.language);
    });

    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
      welcomeHeading.textContent = dictionary.goodMorning || 'Good morning, Kasun 👋';
    }

    const centreName = document.getElementById('centre-name');
    if (centreName) {
      centreName.textContent = dictionary.katugasthota || 'Katugasthota DEC';
    }

    const headerDate = document.getElementById('header-date');
    if (headerDate) {
      headerDate.textContent = sahasaData.user.date;
    }
  },

  renderNotifications() {
    const panel = document.getElementById('notification-panel');
    if (!panel) return;

    panel.innerHTML = `
      <h4>${t('notificationTitle')}</h4>
      <ul class="notification-list">
        ${sahasaData.notifications.map((item) => `
          <li class="notification-item">
            <span class="notification-dot ${item.type}"></span>
            <span>${item.text}</span>
          </li>
        `).join('')}
      </ul>
    `;
  },

  toggleNotifications() {
    this.state.notificationOpen = !this.state.notificationOpen;
    const panel = document.getElementById('notification-panel');
    if (!panel) return;
    panel.classList.toggle('hidden', !this.state.notificationOpen);
    const toggle = document.getElementById('notification-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(this.state.notificationOpen));
    }
  },

  setLoginScreen(showLogin) {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    if (!loginScreen || !appShell) return;
    loginScreen.classList.toggle('hidden', !showLogin);
    appShell.classList.toggle('hidden', showLogin);
  },

  login() {
    this.state.authenticated = true;
    this.setLoginScreen(false);
    this.renderPage();
  },

  renderPage() {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    this.setActiveNav();
    this.applyLanguage();

    const page = this.state.currentPage;
    if (page === 'dashboard') pageContent.innerHTML = this.renderDashboard();
    if (page === 'inventory') pageContent.innerHTML = this.renderInventory();
    if (page === 'sales') pageContent.innerHTML = this.renderSales();
    if (page === 'forecast') pageContent.innerHTML = this.renderForecast();
    if (page === 'recommendations') pageContent.innerHTML = this.renderRecommendations();
    if (page === 'waste') pageContent.innerHTML = this.renderWaste();
    if (page === 'reports') pageContent.innerHTML = this.renderReports();
    if (page === 'settings') pageContent.innerHTML = this.renderSettings();
  },

  setActiveNav() {
    document.querySelectorAll('.nav-item').forEach((button) => {
      const active = button.dataset.page === this.state.currentPage;
      button.classList.toggle('active', active);
    });
  },

  renderDashboard() {
    const inventoryData = sahasaData.inventory;
    const healthyCount = inventoryData.filter(item => item.status === 'Healthy').length;
    const attentionCount = inventoryData.filter(item => item.status === 'Attention').length;
    const criticalCount = inventoryData.filter(item => item.status === 'Critical').length;

    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('dashboard')}</h2>
            <p>${t('dashboardSubtitle')}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="card kpi-card">
            <div class="kpi-top">
              <div>
                <h3>${t('todaySales')}</h3>
              </div>
              <div class="kpi-icon">💵</div>
            </div>
            <p class="kpi-value">Rs. ${formatCurrency(sahasaData.salesOverview.today)}</p>
            <div class="kpi-meta">
              <span class="bullet" style="background: var(--fresh-green);"></span>
              <span>↑ 8.4% from yesterday</span>
            </div>
          </div>

          <div class="card kpi-card secondary">
            <div class="kpi-top">
              <div>
                <h3>${t('currentStock')}</h3>
              </div>
              <div class="kpi-icon">📦</div>
            </div>
            <p class="kpi-value">${sumCurrentStock()} kg</p>
            <div class="kpi-meta">
              <span class="bullet" style="background: var(--blue);"></span>
              <span>3.2% above last week</span>
            </div>
          </div>

          <div class="card kpi-card secondary">
            <div class="kpi-top">
              <div>
                <h3>${t('forecastDemand')}</h3>
              </div>
              <div class="kpi-icon">📈</div>
            </div>
            <p class="kpi-value">${sumForecastDemand()} kg</p>
            <div class="kpi-meta">
              <span class="bullet" style="background: var(--blue);"></span>
              <span>Based on recent sales</span>
            </div>
          </div>

          <div class="card kpi-card warning">
            <div class="kpi-top">
              <div>
                <h3>${t('estimatedWaste')}</h3>
              </div>
              <div class="kpi-icon">♻️</div>
            </div>
            <p class="kpi-value">${sahasaData.wasteSummary.totalWasteKg} kg</p>
            <div class="kpi-meta warning">
              <span class="bullet" style="background: var(--amber);"></span>
              <span>↓ 2.1% vs previous week</span>
            </div>
          </div>

          <div class="card kpi-card critical">
            <div class="kpi-top">
              <div>
                <h3>${t('atRiskItems')}</h3>
              </div>
              <div class="kpi-icon">⚠️</div>
            </div>
            <p class="kpi-value">${criticalCount + attentionCount}</p>
            <div class="kpi-meta negative">
              <span class="bullet" style="background: var(--red);"></span>
              <span>Needs review today</span>
            </div>
          </div>
        </div>

        <div class="plain-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>${t('inventoryHealth')}</h3>
            </div>
            <div class="status-list">
              <div class="status-pill healthy">
                <span>${t('healthyStock')}</span>
                <strong>${healthyCount}</strong>
                <small>${t('vegetable').toLowerCase()}</small>
              </div>
              <div class="status-pill warning">
                <span>${t('attentionNeeded')}</span>
                <strong>${attentionCount}</strong>
                <small>${t('vegetable').toLowerCase()}</small>
              </div>
              <div class="status-pill critical">
                <span>${t('critical')}</span>
                <strong>${criticalCount}</strong>
                <small>${t('vegetable').toLowerCase()}</small>
              </div>
            </div>
          </div>

          <div class="panel smart-insight">
            <div class="insight-head">
              <h3>${t('smartInsight')}</h3>
              <span class="badge healthy">AI Assisted</span>
            </div>
            <div class="insight-box">
              <p class="insight-text">“Carrot demand is expected to increase by approximately 18% over the next 3 days.”</p>
              <div class="inline-stat">
                <div><span class="muted">Recommended purchase:</span><strong> +120 kg</strong></div>
              </div>
              <p class="muted">Reason: “Recent sales increased and upcoming demand is higher than the current stock level.”</p>
              <div class="insight-actions">
                <button class="action-btn primary" data-page="forecast">${t('viewForecast')}</button>
                <button class="action-btn" data-page="recommendations">${t('viewRecommendation')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderInventory() {
    const allRows = sahasaData.inventory.filter((item) => {
      const matchesStatus = this.state.inventoryFilter === 'All' || item.status === this.state.inventoryFilter;
      const matchesSearch = !this.state.searchTerm || item.vegetable.toLowerCase().includes(this.state.searchTerm);
      return matchesStatus && matchesSearch;
    });

    const rows = allRows.map((item) => `
      <tr>
        <td>${item.vegetable}</td>
        <td>${item.opening} kg</td>
        <td>${item.received} kg</td>
        <td>${item.sold} kg</td>
        <td>${item.current} kg</td>
        <td>${item.forecast} kg</td>
        <td><span class="badge ${statusClass(item.status)}">${item.status}</span></td>
        <td>${item.recommendation}</td>
      </tr>
    `).join('');

    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('inventory')}</h2>
            <p>${t('inventoryHealth')}</p>
          </div>
          <button class="primary-btn" data-record-stock="true">${t('recordStock')}</button>
        </div>

        <div class="panel">
          <div class="inventory-toolbar">
            <div class="search-box">
              <input id="inventory-search" type="text" value="${this.state.searchTerm}" placeholder="${t('inventorySearch')}" aria-label="Search vegetables" />
            </div>

            <div class="filter-row">
              ${['All', 'Healthy', 'Attention', 'Critical'].map((filter) => `
                <button class="filter-chip ${this.state.inventoryFilter === filter ? 'active' : ''}" data-filter="${filter}">${t(filter === 'All' ? 'filterAll' : filter === 'Healthy' ? 'filterHealthy' : filter === 'Attention' ? 'filterAttention' : 'filterCritical')}</button>
              `).join('')}
            </div>
          </div>

          <div class="table-wrap" style="margin-top: 18px;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t('vegetable')}</th>
                  <th>${t('openingStock')}</th>
                  <th>${t('received')}</th>
                  <th>${t('sold')}</th>
                  <th>${t('currentStockLabel')}</th>
                  <th>${t('forecastDemandLabel')}</th>
                  <th>${t('status')}</th>
                  <th>${t('recommendation')}</th>
                </tr>
              </thead>
              <tbody>
                ${rows || `<tr><td colspan="8"><div class="empty-state"><h3>${t('unableToLoad')}</h3><p>${t('checkConnection')}</p><button class="primary-btn" data-retry="true">${t('retry')}</button></div></td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  renderSales() {
    const salesChartSvg = this.makeLineChart(sahasaData.salesTrend, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('sales')}</h2>
            <p>${t('salesTrend')}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="card kpi-card secondary">
            <div class="kpi-top">
              <div><h3>${t('todaySalesPage')}</h3></div>
              <div class="kpi-icon">💰</div>
            </div>
            <p class="kpi-value">Rs. ${formatCurrency(sahasaData.salesOverview.today)}</p>
            <div class="kpi-meta"><span class="bullet" style="background: var(--fresh-green);"></span><span>↑ 8.4%</span></div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-top">
              <div><h3>${t('weeklySales')}</h3></div>
              <div class="kpi-icon">📅</div>
            </div>
            <p class="kpi-value">Rs. ${formatCurrency(sahasaData.salesOverview.weekly)}</p>
            <div class="kpi-meta"><span class="bullet" style="background: var(--blue);"></span><span>${t('strongWeek')}</span></div>
          </div>

          <div class="card kpi-card warning">
            <div class="kpi-top">
              <div><h3>${t('monthlySales')}</h3></div>
              <div class="kpi-icon">📊</div>
            </div>
            <p class="kpi-value">Rs. ${formatCurrency(sahasaData.salesOverview.monthly)}</p>
            <div class="kpi-meta warning"><span class="bullet" style="background: var(--amber);"></span><span>${t('stableGrowth')}</span></div>
          </div>
        </div>

        <div class="performance-grid">
          <div class="chart-card">
            <div class="panel-header">
              <h3>${t('salesTrend')}</h3>
            </div>
            ${salesChartSvg}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>${t('vegetablePerformance')}</h3>
            </div>
            <div class="performance-list">
              ${sahasaData.salesPerformance.map(item => `
                <div class="metric-block">
                  <div>
                    <div class="metric-label">${item.vegetable}</div>
                    <div class="muted">${item.sold} kg</div>
                  </div>
                  <div style="text-align: right;">
                    <div class="metric-value" style="font-size: 1.1rem;">${item.revenue}</div>
                    <div class="badge healthy">${item.trend}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderForecast() {
    const selected = this.state.selectedForecast;
    const data = sahasaData.forecastData[selected];
    const chartSvg = this.makeForecastChart(data.historical, data.forecast);

    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('demandForecast')}</h2>
            <p>${t('forecastSubtitle')}</p>
          </div>
          <div class="search-box" style="min-width: 180px;">
            <select class="forecast-select" aria-label="Select vegetable">
              ${Object.keys(sahasaData.forecastData).map((veg) => `
                <option value="${veg}" ${veg === selected ? 'selected' : ''}>${veg}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="chart-card">
          ${chartSvg}
        </div>

        <div class="summary-grid">
          <div class="summary-box">
            <h4>${t('next3Days')}</h4>
            <strong>${data.next3} kg</strong>
          </div>
          <div class="summary-box">
            <h4>${t('next7Days')}</h4>
            <strong>${data.next7} kg</strong>
          </div>
          <div class="summary-box">
            <h4>${t('forecastReliability')}</h4>
            <strong>${data.reliability}</strong>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>${t('whatInfluenced')}</h3>
          </div>
          <div class="status-list">
            ${data.influences.map((item) => `
              <div class="summary-box">
                <h4>${item.label}</h4>
                <strong style="font-size: 1.1rem;">${item.strength}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  renderRecommendations() {
    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('smartInventoryRecommendations')}</h2>
            <p>${t('recommendationSubtitle')}</p>
          </div>
        </div>

        <div class="recommendation-list" style="display: grid; gap: 18px;">
          ${sahasaData.recommendations.map((item) => {
            const translatedTitle = item.status === 'healthy' ? t('noPurchaseRequired') : item.status === 'warning' ? t('recommendedPurchase') : t('highRisk');
            const translatedReason = item.vegetable === 'Carrot' ? t('insightReason') : item.vegetable === 'Cabbage' ? t('maintainCurrentStock') : t('insightReason');
            const reasons = item.vegetable === 'Carrot'
              ? [t('recentSales'), t('currentStockShort'), t('seasonalPattern')]
              : item.vegetable === 'Cabbage'
                ? [t('currentStockShort'), t('recentSales'), t('healthyStockZone')]
                : [t('criticalStock'), t('recentSales'), t('insightReason')];

            return `
            <article class="recommendation-card ${item.status}">
              <div class="rec-header">
                <h3>${item.vegetable}</h3>
                <span class="badge ${item.status === 'healthy' ? 'healthy' : item.status === 'warning' ? 'warning' : 'critical'}">${translatedTitle}</span>
              </div>
              <div class="rec-metrics">
                <div><span>${t('currentStockShort')}</span><strong>${item.currentStock} kg</strong></div>
                <div><span>${t('expectedDemandShort')}</span><strong>${item.expectedDemand} kg</strong></div>
                <div><span>${t('recommendedPurchase')}</span><strong>${item.recommendedPurchase} kg</strong></div>
                <div><span>${t('recommendation')}</span><strong>${item.status === 'healthy' ? t('noPurchaseRequired') : translatedTitle}</strong></div>
              </div>
              <p class="rec-reason">${translatedReason}</p>

              <div class="panel" style="padding: 14px;">
                <h4 style="margin: 0 0 10px; font-size: 1rem;">${t('whyRecommendation')}</h4>
                <ul>
                  ${reasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
              </div>

              <div class="rec-actions">
                <button class="primary-btn" data-accept="true">${t('acceptRecommendation')}</button>
                <button class="ghost-btn" data-detail="${item.vegetable}">${t('viewDetails')}</button>
              </div>
            </article>
          `;
          }).join('')}
        </div>
      </section>
    `;
  },

  renderWaste() {
    const vegetables = ['Carrot', 'Cabbage', 'Green Beans', 'Tomato', 'Potato'];
    const values = vegetables.map((veg) => sahasaData.wasteSummary.byVegetable[veg]);
    const maxValue = Math.max(...values);
    const barHtml = vegetables.map((veg) => {
      const value = sahasaData.wasteSummary.byVegetable[veg];
      const height = Math.max((value / maxValue) * 150, 24);
      return `
        <div class="bar-col">
          <div class="bar" style="height: ${height}px;"></div>
          <div class="bar-label">${veg}</div>
        </div>
      `;
    }).join('');

    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('waste')}</h2>
            <p>${t('sampleValues')}</p>
          </div>
        </div>

        <div class="waste-grid">
          <div class="card kpi-card warning">
            <div class="kpi-top"><div><h3>${t('totalWaste')}</h3></div><div class="kpi-icon">♻️</div></div>
            <p class="kpi-value">${sahasaData.wasteSummary.totalWasteKg} kg</p>
            <div class="kpi-meta warning"><span class="bullet" style="background: var(--amber);"></span><span>Sample value</span></div>
          </div>

          <div class="card kpi-card secondary">
            <div class="kpi-top"><div><h3>${t('wasteRate')}</h3></div><div class="kpi-icon">📉</div></div>
            <p class="kpi-value">${sahasaData.wasteSummary.wasteRate}%</p>
            <div class="kpi-meta"><span class="bullet" style="background: var(--blue);"></span><span>Sample value</span></div>
          </div>

          <div class="card kpi-card critical">
            <div class="kpi-top"><div><h3>${t('estimatedLoss')}</h3></div><div class="kpi-icon">💸</div></div>
            <p class="kpi-value">Rs. ${formatCurrency(sahasaData.wasteSummary.estimatedLoss)}</p>
            <div class="kpi-meta negative"><span class="bullet" style="background: var(--red);"></span><span>Sample value</span></div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-top"><div><h3>${t('forecastReliability')}</h3></div><div class="kpi-icon">📊</div></div>
            <p class="kpi-value">Good</p>
            <div class="kpi-meta"><span class="bullet" style="background: var(--fresh-green);"></span><span>Prototype only</span></div>
          </div>
        </div>

        <div class="plain-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>${t('wasteByVegetable')}</h3>
            </div>
            <div class="bar-chart">
              ${barHtml}
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>${t('mainWasteContributors')}</h3>
            </div>
            <div class="contributors">
              ${sahasaData.wasteContributors.map((item) => `
                <div class="contributor-row">
                  <span style="min-width: 130px; font-weight: 600;">${item.label}</span>
                  <div class="contributor-bar">
                    <div class="contributor-fill" style="width: ${item.value}%"></div>
                  </div>
                  <strong>${item.value}%</strong>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderReports() {
    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('reports')}</h2>
            <p>${t('generatePracticalSummary')}</p>
          </div>
        </div>

        <div class="report-grid">
          ${sahasaData.reports.map((report) => `
            <div class="report-card">
              <div>
                <h4>${report.title}</h4>
                <p>${report.description}</p>
              </div>
              <button class="primary-btn" data-report="${report.title}">${t('generateReport')}</button>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  renderSettings() {
    return `
      <section class="page-section">
        <div class="page-header">
          <div>
            <h2>${t('settings')}</h2>
            <p>${t('updatePreferences')}</p>
          </div>
        </div>

        <div class="settings-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>${t('profile')}</h3>
            </div>
            <div class="field-group">
              <label>${t('businessName')}</label>
              <input type="text" value="${sahasaData.settings.businessName}" />
            </div>
            <div class="field-group">
              <label>${t('economicCentre')}</label>
              <input type="text" value="${sahasaData.settings.economicCentre}" />
            </div>
            <div class="field-group">
              <label>${t('contact')}</label>
              <input type="text" value="${sahasaData.settings.contact}" />
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>${t('language')}</h3>
            </div>
            <div class="field-group">
              <label>${t('preferredUnit')}</label>
              <div class="switch-row">
                <label><input type="radio" name="unit" checked /> kg</label>
                <label><input type="radio" name="unit" /> units</label>
              </div>
            </div>
            <div class="field-group">
              <label>${t('notifications')}</label>
              <div class="switch-row">
                <label><input type="checkbox" checked /> Email</label>
                <label><input type="checkbox" checked /> SMS</label>
              </div>
            </div>
            <div class="field-group">
              <label>${t('systemPreferences')}</label>
              <div class="switch-row">
                <label><input type="checkbox" checked /> ${t('lowStockAlerts')}</label>
              </div>
            </div>
            <button id="save-settings-btn" class="primary-btn">${t('saveChanges')}</button>
          </div>
        </div>
      </section>
    `;
  },

  openStockModal() {
    const modal = `
      <div class="modal-backdrop" id="stock-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Record stock">
          <div class="modal-header">
            <h3>${t('addStock')}</h3>
            <button type="button" class="modal-close" data-close-modal="true" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <form id="stock-form">
              <div class="form-grid">
                <div class="field-group full">
                  <label for="stock-vegetable">${t('vegetable')}</label>
                  <select id="stock-vegetable">
                    ${sahasaData.inventory.map(item => `<option value="${item.vegetable}">${item.vegetable}</option>`).join('')}
                  </select>
                </div>
                <div class="field-group">
                  <label for="stock-quantity">${t('quantity')}</label>
                  <input id="stock-quantity" type="number" min="1" step="1" value="50" />
                </div>
                <div class="field-group">
                  <label for="stock-type">${t('type')}</label>
                  <select id="stock-type">
                    <option value="Received">${t('received')}</option>
                    <option value="Sold">${t('sold')}</option>
                    <option value="Waste">Waste</option>
                  </select>
                </div>
                <div class="field-group full">
                  <label for="stock-date">${t('date')}</label>
                  <input id="stock-date" type="date" value="2026-09-05" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="ghost-btn" data-close-modal="true">${t('cancel')}</button>
            <button id="save-stock-btn" type="button" class="primary-btn">${t('save')}</button>
          </div>
        </div>
      </div>
    `;
    this.openModal(modal);
  },

  openRecommendationModal(item) {
    const modal = `
      <div class="modal-backdrop" id="recommendation-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Recommendation details">
          <div class="modal-header">
            <h3>${item.vegetable}</h3>
            <button type="button" class="modal-close" data-close-modal="true" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <p><strong>${t('recommendedPurchase')}:</strong> ${item.recommendedPurchase} kg</p>
            <p><strong>${t('currentStockShort')}:</strong> ${item.currentStock} kg</p>
            <p><strong>${t('expectedDemandShort')}:</strong> ${item.expectedDemand} kg</p>
            <p><strong>${t('why')}:</strong> ${item.reason}</p>
            <ul>
              ${item.why.map((reason) => `<li>${reason}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="ghost-btn" data-close-modal="true">${t('close')}</button>
          </div>
        </div>
      </div>
    `;
    this.openModal(modal);
  },

  openModal(content) {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = content;
  },

  closeModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  },

  saveStockRecord() {
    const vegetable = document.getElementById('stock-vegetable')?.value;
    const quantity = Number(document.getElementById('stock-quantity')?.value || 0);
    const type = document.getElementById('stock-type')?.value;

    if (!vegetable || !quantity || quantity <= 0) {
      this.showToast(t('invalidQuantity'));
      return;
    }

    const item = sahasaData.inventory.find(entry => entry.vegetable === vegetable);
    if (item) {
      if (type === 'Received') item.received += quantity;
      if (type === 'Sold') item.sold += quantity;
      if (type === 'Waste') item.waste += quantity;
      item.current = Math.max(0, item.current + (type === 'Received' ? quantity : type === 'Sold' ? -quantity : -quantity));
    }

    this.closeModal();
    this.renderPage();
    this.showToast(t('stockSaved'));
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.add('hidden'), 2400);
  },

  makeLineChart(values, labels) {
    const max = Math.max(...values) * 1.2;
    const min = Math.min(...values) * 0.8;
    const width = 640;
    const height = 220;
    const left = 24;
    const top = 20;
    const chartHeight = height - 40;
    const chartWidth = width - 50;

    const points = values.map((value, index) => {
      const x = left + (index / (values.length - 1)) * chartWidth;
      const y = top + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((step) => {
      const y = top + chartHeight * step;
      return `<line x1="${left}" y1="${y}" x2="${width - 14}" y2="${y}" stroke="rgba(148,163,184,0.2)" stroke-dasharray="4 4" />`;
    }).join('');

    const labelsMarkup = labels.map((label, index) => {
      const x = left + (index / (labels.length - 1)) * chartWidth;
      return `<text x="${x}" y="${height - 5}" text-anchor="middle" fill="#64748b" font-size="11">${label}</text>`;
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Sales trend chart">
        ${gridLines}
        <polyline fill="none" stroke="#14532d" stroke-width="4" points="${points}" stroke-linecap="round" stroke-linejoin="round" />
        ${values.map((value, index) => {
          const x = left + (index / (values.length - 1)) * chartWidth;
          const y = top + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
          return `<circle cx="${x}" cy="${y}" r="4" fill="#22c55e" />`;
        }).join('')}
        ${labelsMarkup}
      </svg>
    `;
  },

  makeForecastChart(historical, forecast) {
    const max = Math.max(...historical.concat(forecast)) * 1.15;
    const min = Math.min(...historical.concat(forecast)) * 0.8;
    const width = 760;
    const height = 260;
    const left = 28;
    const top = 20;
    const chartHeight = height - 50;
    const chartWidth = width - 60;

    const historicalPoints = historical.map((value, index) => {
      const x = left + (index / (historical.length - 1)) * chartWidth;
      const y = top + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const forecastPoints = forecast.map((value, index) => {
      const x = left + (index / (forecast.length - 1)) * chartWidth;
      const y = top + chartHeight - ((value - min) / (max - min || 1)) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Demand forecast chart">
        ${[0, 0.25, 0.5, 0.75, 1].map((step) => `<line x1="${left}" y1="${top + chartHeight * step}" x2="${width - 20}" y2="${top + chartHeight * step}" stroke="rgba(148,163,184,0.15)" stroke-dasharray="6 5" />`).join('')}
        <polyline fill="none" stroke="#22c55e" stroke-width="4" points="${historicalPoints}" />
        <polyline fill="none" stroke="#14532d" stroke-width="4" points="${forecastPoints}" stroke-dasharray="10 8" />
        <text x="${left}" y="18" fill="#14532d" font-size="12" font-weight="700">${t('historicalDemand')}</text>
        <text x="${width - 160}" y="18" fill="#14532d" font-size="12" font-weight="700">${t('forecastDemandChart')}</text>
        ${Array.from({ length: 7 }).map((_, index) => {
          const x = left + (index / 6) * chartWidth;
          return `<text x="${x}" y="${height - 12}" text-anchor="middle" fill="#64748b" font-size="11">D${index + 1}</text>`;
        }).join('')}
      </svg>
    `;
  }
};

function t(key) {
  const dictionary = window.translations && window.translations[app.state.language];
  return (dictionary && dictionary[key]) || key;
}

function sumCurrentStock() {
  return sahasaData.inventory.reduce((sum, item) => sum + item.current, 0);
}

function sumForecastDemand() {
  return sahasaData.inventory.reduce((sum, item) => sum + item.forecast, 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function statusClass(status) {
  if (status === 'Healthy') return 'healthy';
  if (status === 'Attention') return 'warning';
  return 'critical';
}

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
