import React from 'react';

const OrdersList = ({ orders, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned':
        return 'Assigned';
      case 'picked_up':
        return 'Picked Up';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'assigned':
        return { action: 'picked_up', text: 'Mark as Picked Up', color: 'bg-yellow-500 hover:bg-yellow-600' };
      case 'picked_up':
        return { action: 'delivered', text: 'Mark as Delivered', color: 'bg-green-500 hover:bg-green-600' };
      default:
        return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders assigned</h3>
        <p className="text-gray-600">You don't have any orders assigned at the moment.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {orders.map((order) => {
        const nextAction = getNextAction(order.status);
        
        return (
          <div key={order.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned: {formatTime(order.assignedAt)}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Customer</h4>
                    <p className="text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Delivery Address</h4>
                    <p className="text-gray-900">{order.customerAddress}</p>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-orange-600 font-medium">
                        ETA: {order.estimatedDelivery}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {nextAction && (
                    <button
                      onClick={() => onStatusUpdate(order.id, nextAction.action)}
                      className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${nextAction.color}`}
                    >
                      {nextAction.text}
                    </button>
                  )}
                  
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Call Customer
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    View Map
                  </button>
                </div>

                {/* Delivery Confirmation */}
                {order.status === 'delivered' && order.deliveredAt && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-green-700">
                        Delivered at {formatTime(order.deliveredAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;