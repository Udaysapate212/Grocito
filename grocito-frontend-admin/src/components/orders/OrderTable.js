import React, { useState } from 'react';

const OrderTable = ({ orders, onView, onUpdateStatus, onCancel, onBulkStatusUpdate, adminInfo }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'PLACED': 'PACKED',
      'PACKED': 'OUT_FOR_DELIVERY',
      'OUT_FOR_DELIVERY': 'DELIVERED'
    };
    return statusFlow[currentStatus];
  };

  const canUpdateStatus = (order) => {
    // Check role-based permissions
    if (adminInfo?.isSuperAdmin) return true;
    if (adminInfo?.isRegionalAdmin && order.pincode === adminInfo.pincode) return true;
    return false;
  };

  const canCancelOrder = (order) => {
    return canUpdateStatus(order) && order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handleBulkUpdate = () => {
    if (selectedOrders.length === 0 || !bulkStatus) return;
    onBulkStatusUpdate(selectedOrders, bulkStatus);
    setSelectedOrders([]);
    setBulkStatus('');
  };

  if (orders.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No orders match your current filters. Try adjusting your search criteria or check back later for new orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">{selectedOrders.length}</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">
                    {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                  </h3>
                  <p className="text-sm text-blue-700">Choose an action to apply to selected orders</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-4 py-2 text-sm border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="PACKED">Mark as Packed</option>
                  <option value="OUT_FOR_DELIVERY">Mark as Out for Delivery</option>
                  <option value="DELIVERED">Mark as Delivered</option>
                  <option value="CANCELLED">Cancel Orders</option>
                </select>
                <button
                  onClick={handleBulkUpdate}
                  disabled={!bulkStatus}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Orders
                </button>
                  onClick={() => setSelectedOrders([])}
                  className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-xl transition-all duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Select All Option */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedOrders.length === orders.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select all {orders.length} orders
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card group hover:shadow-soft-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-start justify-between">
                {/* Left Section - Order Info */}
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <span className="text-xl">🛒</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600 font-medium">{formatDateTime(order.orderTime)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">👤</span>
                          <h4 className="font-semibold text-gray-900">Customer</h4>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{order.user?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-600">{order.user?.email || 'N/A'}</p>
                      </div>
                      
                      {/* Order Details */}
                      <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📦</span>
                          <h4 className="font-semibold text-gray-900">Items</h4>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      
                      {/* Location */}
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📍</span>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Pincode: {order.pincode}</p>
                        <p className="text-xs text-gray-600 truncate">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Status & Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status ? order.status.replace('_', ' ') : 'Unknown'}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(order)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-soft"
                    >
                      View Details
                    </button>
                    
                    {canUpdateStatus(order) && getNextStatus(order.status) && (
                      <button
                        onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-soft"
                      >
                        Mark as {getNextStatus(order.status).replace('_', ' ')}
                      </button>
                    )}
                    
                    {canUpdateStatus(order) && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => onCancel(order.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-soft"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No orders match your current filters. Try adjusting your search criteria or check back later for new orders.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;