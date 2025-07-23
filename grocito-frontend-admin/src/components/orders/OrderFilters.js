import React from 'react';

const OrderFilters = ({ filters, onFilterChange, adminInfo }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'orderTime',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.dateFrom || filters.dateTo;

  const orderStatuses = [
    { value: 'PLACED', label: 'Placed', color: 'text-blue-600' },
    { value: 'PACKED', label: 'Packed', color: 'text-yellow-600' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'text-purple-600' },
    { value: 'DELIVERED', label: 'Delivered', color: 'text-green-600' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-600' }
  ];

  // Get today's date for date input max values
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">🔍 Filter Orders</h3>
              <p className="text-sm text-gray-600">Search and filter your orders</p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by order ID, customer name, email, or address..."
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
            >
              <option value="">All Status</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              max={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
          />
        </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              max={today}
              min={filters.dateFrom || undefined}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
            />
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
            >
              <option value="orderTime">Sort by Date</option>
              <option value="totalAmount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
              <option value="pincode">Sort by Pincode</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="card-body border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                🔍 Search: "{filters.search}"
                <button
                  onClick={() => handleInputChange('search', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                📊 Status: {orderStatuses.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => handleInputChange('status', '')}
                  className="ml-2 text-green-600 hover:text-green-800 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                📅 From: {new Date(filters.dateFrom).toLocaleDateString()}
                <button
                  onClick={() => handleInputChange('dateFrom', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                📅 To: {new Date(filters.dateTo).toLocaleDateString()}
                <button
                  onClick={() => handleInputChange('dateTo', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="card-body border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Filters:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleInputChange('dateFrom', new Date().toISOString().split('T')[0])}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 rounded-xl border border-blue-200 transition-all duration-200 hover:shadow-soft"
          >
            📅 Today
          </button>
          <button
            onClick={() => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              handleInputChange('dateFrom', weekAgo.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-800 rounded-xl border border-purple-200 transition-all duration-200 hover:shadow-soft"
          >
            📊 Last 7 Days
          </button>
          <button
            onClick={() => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              handleInputChange('dateFrom', monthAgo.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800 rounded-xl border border-green-200 transition-all duration-200 hover:shadow-soft"
          >
            📈 Last 30 Days
          </button>
          
          {/* Status Quick Filters */}
          {orderStatuses.slice(0, 3).map((status, index) => {
            const colors = [
              'from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 text-orange-800 border-orange-200',
              'from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 text-yellow-800 border-yellow-200',
              'from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800 border-green-200'
            ];
            return (
              <button
                key={status.value}
                onClick={() => handleInputChange('status', status.value)}
                className={`px-4 py-2 text-sm font-medium bg-gradient-to-r ${colors[index]} rounded-xl border transition-all duration-200 hover:shadow-soft ${
                  filters.status === status.value ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region Info for Regional Admins */}
      {adminInfo?.isRegionalAdmin && (
        <div className="card-body border-t border-gray-100">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Regional View</h4>
                <p className="text-sm text-blue-800">
                  Showing orders for your region: <strong>{adminInfo.pincode}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;