import React from 'react';

const ProductStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      emoji: '🥬',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      emoji: '📂',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount,
      emoji: '⚠️',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockCount,
      emoji: '❌',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    {
      title: 'Average Price',
      value: formatCurrency(stats.averagePrice || 0),
      emoji: '💰',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card group bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Stock Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
              📊 Stock Distribution
            </h3>
            <p className="text-gray-600 text-sm mt-1">Current inventory status</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700">In Stock (>10)</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{stats.stockDistribution?.inStock || 0}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                    style={{ width: `${((stats.stockDistribution?.inStock || 0) / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700">Low Stock (1-10)</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">{stats.stockDistribution?.lowStock || 0}</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                    style={{ width: `${((stats.stockDistribution?.lowStock || 0) / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700">Out of Stock</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{stats.stockDistribution?.outOfStock || 0}</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" 
                    style={{ width: `${((stats.stockDistribution?.outOfStock || 0) / stats.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              📂 Categories
            </h3>
            <p className="text-gray-600 text-sm mt-1">Product distribution by category</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {Object.entries(stats.categoryDistribution || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, count], index) => {
                  const colors = [
                    'from-blue-500 to-indigo-500',
                    'from-purple-500 to-pink-500',
                    'from-green-500 to-emerald-500',
                    'from-orange-500 to-yellow-500',
                    'from-red-500 to-pink-500'
                  ];
                  const bgColors = [
                    'from-blue-50 to-indigo-50 border-blue-200',
                    'from-purple-50 to-pink-50 border-purple-200',
                    'from-green-50 to-emerald-50 border-green-200',
                    'from-orange-50 to-yellow-50 border-orange-200',
                    'from-red-50 to-pink-50 border-red-200'
                  ];
                  
                  return (
                    <div key={category} className={`p-3 bg-gradient-to-br ${bgColors[index]} rounded-xl border`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900 capitalize">{category}</span>
                        <span className="text-lg font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${colors[index]} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${(count / stats.totalProducts) * 100}%` }}
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

export default ProductStats;