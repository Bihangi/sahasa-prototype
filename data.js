const sahasaData = {
  user: {
    name: 'Kasun',
    centre: 'Katugasthota DEC',
    date: '05 September 2026'
  },
  inventory: [
    {
      vegetable: 'Carrot',
      opening: 500,
      received: 200,
      sold: 420,
      current: 280,
      forecast: 390,
      status: 'Attention',
      recommendation: 'Purchase 110 kg',
      trend: '↑ 12%',
      waste: 18
    },
    {
      vegetable: 'Cabbage',
      opening: 450,
      received: 100,
      sold: 300,
      current: 250,
      forecast: 210,
      status: 'Healthy',
      recommendation: 'No action',
      trend: '↑ 6%',
      waste: 10
    },
    {
      vegetable: 'Green Beans',
      opening: 300,
      received: 100,
      sold: 350,
      current: 50,
      forecast: 180,
      status: 'Critical',
      recommendation: 'Purchase 130 kg',
      trend: '↓ 15%',
      waste: 24
    },
    {
      vegetable: 'Tomato',
      opening: 390,
      received: 180,
      sold: 360,
      current: 210,
      forecast: 260,
      status: 'Attention',
      recommendation: 'Purchase 70 kg',
      trend: '↑ 8%',
      waste: 14
    },
    {
      vegetable: 'Potato',
      opening: 420,
      received: 160,
      sold: 330,
      current: 250,
      forecast: 280,
      status: 'Healthy',
      recommendation: 'No action',
      trend: '→ 2%',
      waste: 12
    },
    {
      vegetable: 'Brinjal',
      opening: 240,
      received: 110,
      sold: 180,
      current: 170,
      forecast: 220,
      status: 'Healthy',
      recommendation: 'No action',
      trend: '↑ 4%',
      waste: 9
    },
    {
      vegetable: 'Pumpkin',
      opening: 260,
      received: 80,
      sold: 140,
      current: 200,
      forecast: 170,
      status: 'Healthy',
      recommendation: 'No action',
      trend: '→ 3%',
      waste: 8
    },
    {
      vegetable: 'Capsicum',
      opening: 180,
      received: 90,
      sold: 170,
      current: 100,
      forecast: 150,
      status: 'Critical',
      recommendation: 'Purchase 60 kg',
      trend: '↓ 9%',
      waste: 15
    }
  ],

  salesOverview: {
    today: 128500,
    weekly: 642300,
    monthly: 2865000
  },

  salesTrend: [120, 190, 160, 210, 240, 310, 320],
  salesPerformance: [
    { vegetable: 'Carrot', sold: 420, revenue: 'Rs. 68,500', trend: '↑ 12%' },
    { vegetable: 'Cabbage', sold: 300, revenue: 'Rs. 42,000', trend: '↑ 6%' },
    { vegetable: 'Green Beans', sold: 350, revenue: 'Rs. 58,200', trend: '↑ 11%' },
    { vegetable: 'Tomato', sold: 360, revenue: 'Rs. 64,800', trend: '↑ 9%' },
    { vegetable: 'Potato', sold: 330, revenue: 'Rs. 46,500', trend: '→ 2%' }
  ],

  forecastData: {
    Carrot: {
      historical: [250, 280, 295, 320, 350, 380, 390],
      forecast: [330, 360, 420, 450, 470, 500, 530],
      next3: 420,
      next7: 960,
      reliability: 'Good',
      influences: [
        { label: 'Recent Sales', strength: 'High influence', direction: 'up' },
        { label: 'Recent Price', strength: 'Moderate influence', direction: 'flat' },
        { label: 'Weather', strength: 'Moderate influence', direction: 'up' },
        { label: 'Seasonal Pattern', strength: 'Low influence', direction: 'flat' }
      ]
    },
    Cabbage: {
      historical: [220, 240, 245, 260, 230, 250, 270],
      forecast: [230, 245, 255, 265, 270, 275, 290],
      next3: 255,
      next7: 690,
      reliability: 'Good',
      influences: [
        { label: 'Recent Sales', strength: 'Moderate influence', direction: 'up' },
        { label: 'Recent Price', strength: 'Low influence', direction: 'flat' },
        { label: 'Weather', strength: 'Moderate influence', direction: 'down' },
        { label: 'Seasonal Pattern', strength: 'Low influence', direction: 'flat' }
      ]
    },
    'Green Beans': {
      historical: [180, 220, 240, 260, 290, 300, 320],
      forecast: [260, 300, 350, 390, 420, 450, 470],
      next3: 350,
      next7: 820,
      reliability: 'Good',
      influences: [
        { label: 'Recent Sales', strength: 'High influence', direction: 'up' },
        { label: 'Recent Price', strength: 'Moderate influence', direction: 'flat' },
        { label: 'Weather', strength: 'High influence', direction: 'up' },
        { label: 'Seasonal Pattern', strength: 'Low influence', direction: 'flat' }
      ]
    },
    Tomato: {
      historical: [200, 210, 240, 260, 290, 330, 350],
      forecast: [300, 340, 360, 390, 420, 430, 450],
      next3: 360,
      next7: 850,
      reliability: 'Good',
      influences: [
        { label: 'Recent Sales', strength: 'High influence', direction: 'up' },
        { label: 'Recent Price', strength: 'Moderate influence', direction: 'flat' },
        { label: 'Weather', strength: 'Moderate influence', direction: 'up' },
        { label: 'Seasonal Pattern', strength: 'Low influence', direction: 'flat' }
      ]
    },
    Potato: {
      historical: [180, 200, 210, 230, 250, 260, 280],
      forecast: [240, 255, 270, 290, 300, 320, 340],
      next3: 270,
      next7: 720,
      reliability: 'Good',
      influences: [
        { label: 'Recent Sales', strength: 'Moderate influence', direction: 'up' },
        { label: 'Recent Price', strength: 'Low influence', direction: 'flat' },
        { label: 'Weather', strength: 'Moderate influence', direction: 'down' },
        { label: 'Seasonal Pattern', strength: 'Low influence', direction: 'flat' }
      ]
    }
  },

  recommendations: [
    {
      vegetable: 'Carrot',
      status: 'warning',
      title: 'Purchase Recommended',
      currentStock: 280,
      expectedDemand: 390,
      recommendedPurchase: 110,
      reason: 'Expected demand is higher than available stock.',
      why: [
        'Recent sales increased',
        'Current stock is below expected demand',
        'Recent demand pattern indicates an upward trend'
      ]
    },
    {
      vegetable: 'Cabbage',
      status: 'healthy',
      title: 'No Purchase Required',
      currentStock: 250,
      expectedDemand: 210,
      recommendedPurchase: 0,
      reason: 'Maintain current stock.',
      why: [
        'Current stock remains above expected demand',
        'Recent sales are stable',
        'Inventory is within the recommended range'
      ]
    },
    {
      vegetable: 'Green Beans',
      status: 'critical',
      title: 'High Risk',
      currentStock: 50,
      expectedDemand: 180,
      recommendedPurchase: 130,
      reason: 'Expected demand is far above the current stock level.',
      why: [
        'Current stock is critically low',
        'Recent sales are higher than usual',
        'Short-term demand is expected to rise'
      ]
    }
  ],

  wasteSummary: {
    totalWasteKg: 86,
    wasteRate: 6.4,
    estimatedLoss: 12800,
    byVegetable: {
      Carrot: 18,
      Cabbage: 10,
      'Green Beans': 24,
      Tomato: 14,
      Potato: 12,
      Brinjal: 9,
      Pumpkin: 8,
      Capsicum: 15
    }
  },

  wasteContributors: [
    { label: 'Overstocking', value: 42 },
    { label: 'Unsold Produce', value: 31 },
    { label: 'Handling / Storage', value: 17 },
    { label: 'Other', value: 10 }
  ],

  reports: [
    { title: 'Daily Inventory Report', description: 'Updated daily stock and replenishment view.' },
    { title: 'Weekly Sales Report', description: 'Summary of weekly sales performance.' },
    { title: 'Waste Summary', description: 'Loss trends by vegetable and waste category.' },
    { title: 'Demand Forecast Report', description: 'Next 7-day expected demand estimate.' },
    { title: 'Purchase Recommendation Report', description: 'Suggested purchase actions and purchasing rationale.' }
  ],

  notifications: [
    { type: 'critical', text: 'Green Beans stock is critically low.' },
    { type: 'warning', text: 'Carrot demand is expected to increase.' },
    { type: 'healthy', text: 'Cabbage inventory is within the recommended range.' }
  ],

  settings: {
    businessName: 'Kasun Vegetable Traders',
    economicCentre: 'Katugasthota DEC',
    contact: '+94 77 550 2144',
    unit: 'kg'
  }
};

window.sahasaData = sahasaData;
