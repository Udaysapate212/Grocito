import React from 'react';

const OrderStats = ({ stats, adminInfo }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLACED': 'bg-blue-100 text-blue-800',
      'PACKED': 'bg-yellow-100 text-yellow-800',
      'OUT_FOR_DELIVERY': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const mainStatCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      emoji: '🛒',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      change: stats.weekOrders ? `+${stats.weekOrders} this week` : null
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      emoji: '💰',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      change: stats.weekRevenue ? `+${formatCurrency(stats.weekRevenue)} this week` : null
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(stats.averageOrderValue || 0),
      emoji: '📊',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Today\'s Orders',
      value: stats.todayOrders || 0,
      emoji: '⏰',
      gradient: 'from-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50',
      borderColor: 'border-orange-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      change: stats.todayRevenue ? formatCurrency(stats.todayRevenue) : null
    }
  ];

  return (
    <div className="mb-8">
      {/* Region Info */}
      {adminInfo && (
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">
                    {adminInfo.isSuperAdmin ? '🌍' : '📍'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {adminInfo.isSuperAdmin ? 'Global Dashboard' : 'Regional Dashboard'}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {adminInfo.isSuperAdmin 
                      ? 'Viewing orders from all regions' 
                      : `Managing orders for pincode: ${adminInfo.pincode}`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-lg font-bold text-gray-900">{adminInfo.name}</p>
                <p className="text-sm text-gray-600 font-medium">{adminInfo.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStatCards.map((stat, index) => (
          <div key={index} className={`stat-card group bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-gray-500 font-medium">{stat.change}</p>
                )}
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-soft`}>
                  {stat.icon}
                </div>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              📊 Order Status
            </h3>
            <p className="text-gray-600 text-sm mt-1">Current order distribution</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {Object.entries(stats.statusDistribution || {})
                .sort(([,a], [,b]) => b - a)
                .map(([status, count]) => (
                  <div key={status} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${getStatusColor(status)}`}>
                        {status.replace('_', ' ')}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Time-based Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
              📅 Time Metrics
            </h3>
            <p className="text-gray-600 text-sm mt-1">Performance over time</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-bold text-gray-900">Today</p>
                      <p className="text-xs text-gray-600">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{stats.todayOrders || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">{formatCurrency(stats.todayRevenue || 0)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-bold text-gray-900">This Week</p>
                      <p className="text-xs text-gray-600">Last 7 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{stats.weekOrders || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">{formatCurrency(stats.weekRevenue || 0)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-bold text-gray-900">This Month</p>
                      <p className="text-xs text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{stats.monthOrders || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">{formatCurrency(stats.monthRevenue || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center">
              📈 Daily Trends
            </h3>
            <p className="text-gray-600 text-sm mt-1">Last 7 days performance</p>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {(stats.dailyTrends || []).map((day, index) => {
                const maxOrders = Math.max(...(stats.dailyTrends || []).map(d => d.orders));
                const percentage = maxOrders > 0 ? (day.orders / maxOrders) * 100 : 0;
                
                return (
                  <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">📅</span>
                        <span className="text-sm font-bold text-gray-700">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{day.orders}</p>
                        <p className="text-xs text-gray-600 font-medium">{formatCurrency(day.revenue)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;