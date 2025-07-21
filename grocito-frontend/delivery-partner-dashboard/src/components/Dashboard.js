import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deliveryPartnerService } from '../services/deliveryPartnerService';
import Header from './Header';
import StatsCard from './StatsCard';
import OrdersList from './OrdersList';

const Dashboard = () => {
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    todayDeliveries: 0,
    pendingOrders: 0,
    earnings: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get delivery partner data from localStorage
    const partnerData = localStorage.getItem('deliveryPartner');
    if (partnerData) {
      try {
        const partner = JSON.parse(partnerData);
        setDeliveryPartner(partner);
        
        // Load dashboard data
        loadDashboardData(partner.id);
      } catch (error) {
        console.error('Error parsing delivery partner data:', error);
        toast.error('Error loading profile data');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async (partnerId) => {
    try {
      setLoading(true);
      
      // Fetch assigned orders from the API
      let assignedOrders = [];
      try {
        assignedOrders = await deliveryPartnerService.getAssignedOrders(partnerId);
      } catch (error) {
        console.error('Error fetching assigned orders:', error);
        // If API fails, use mock data for demo purposes
        assignedOrders = generateMockOrders();
      }
      
      // Calculate stats based on orders
      const totalDeliveries = assignedOrders.filter(order => order.status === 'DELIVERED').length;
      const todayDeliveries = assignedOrders.filter(order => {
        return order.status === 'DELIVERED' && 
               new Date(order.deliveredTime).toDateString() === new Date().toDateString();
      }).length;
      const pendingOrders = assignedOrders.filter(order => 
        order.status === 'PLACED' || order.status === 'PACKED' || order.status === 'OUT_FOR_DELIVERY'
      ).length;
      
      // Calculate earnings (in a real app, this would come from the API)
      const earnings = assignedOrders.reduce((total, order) => {
        return order.status === 'DELIVERED' ? total + (order.totalAmount * 0.1) : total;
      }, 0);
      
      setStats({
        totalDeliveries: totalDeliveries || 0,
        todayDeliveries: todayDeliveries || 0,
        pendingOrders: pendingOrders || 0,
        earnings: earnings || 0
      });
      
      // Format orders for display
      const formattedOrders = assignedOrders.map(order => {
        return {
          id: order.id,
          orderNumber: `ORD-${order.id.toString().padStart(3, '0')}`,
          customerName: order.user ? order.user.fullName : 'Customer',
          customerAddress: order.deliveryAddress || 'Address not available',
          customerPhone: order.user ? order.user.contactNumber : 'Phone not available',
          items: order.items ? order.items.map(item => item.product ? item.product.name : 'Item') : ['Items not available'],
          totalAmount: order.totalAmount || 0,
          status: mapOrderStatus(order.status),
          assignedAt: order.assignedTime || order.orderTime,
          deliveredAt: order.deliveredTime,
          estimatedDelivery: calculateEstimatedDelivery(order)
        };
      });
      
      setOrders(formattedOrders.length > 0 ? formattedOrders : generateMockOrders());
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data');
      
      // Use mock data as fallback
      setStats({
        totalDeliveries: 156,
        todayDeliveries: 8,
        pendingOrders: 3,
        earnings: 2450.50
      });
      setOrders(generateMockOrders());
      setLoading(false);
    }
  };
  
  // Helper function to map backend order status to frontend status
  const mapOrderStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'PLACED': return 'assigned';
      case 'PACKED': return 'assigned';
      case 'OUT_FOR_DELIVERY': return 'picked_up';
      case 'DELIVERED': return 'delivered';
      default: return backendStatus.toLowerCase();
    }
  };
  
  // Helper function to calculate estimated delivery time
  const calculateEstimatedDelivery = (order) => {
    if (order.status === 'DELIVERED') return 'Delivered';
    
    // In a real app, this would be calculated based on distance, traffic, etc.
    return '30 mins';
  };
  
  // Generate mock orders for demo purposes
  const generateMockOrders = () => {
    return [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerAddress: '123 Main St, New York',
        customerPhone: '+1-234-567-8900',
        items: ['Milk', 'Bread', 'Eggs'],
        totalAmount: 25.50,
        status: 'assigned',
        assignedAt: new Date().toISOString(),
        estimatedDelivery: '30 mins'
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerAddress: '456 Oak Ave, New York',
        customerPhone: '+1-234-567-8901',
        items: ['Apples', 'Bananas', 'Orange Juice'],
        totalAmount: 18.75,
        status: 'picked_up',
        assignedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedDelivery: '15 mins'
      },
      {
        id: 3,
        orderNumber: 'ORD-003',
        customerName: 'Mike Johnson',
        customerAddress: '789 Pine St, New York',
        customerPhone: '+1-234-567-8902',
        items: ['Chicken', 'Rice', 'Vegetables'],
        totalAmount: 42.25,
        status: 'delivered',
        assignedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        deliveredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      // Map frontend status to backend status
      let backendStatus;
      switch (newStatus) {
        case 'picked_up': backendStatus = 'OUT_FOR_DELIVERY'; break;
        case 'delivered': backendStatus = 'DELIVERED'; break;
        default: backendStatus = newStatus.toUpperCase();
      }
      
      if (deliveryPartner && deliveryPartner.id) {
        // Call API to update order status
        await deliveryPartnerService.updateOrderStatus(deliveryPartner.id, orderId, backendStatus);
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      toast.success(`Order ${newStatus.replace('_', ' ')} successfully!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header deliveryPartner={deliveryPartner} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {deliveryPartner?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your delivery dashboard for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Deliveries"
            value={stats.totalDeliveries}
            icon="truck"
            color="blue"
          />
          <StatsCard
            title="Today's Deliveries"
            value={stats.todayDeliveries}
            icon="calendar"
            color="green"
          />
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="clock"
            color="yellow"
          />
          <StatsCard
            title="Total Earnings"
            value={`$${stats.earnings.toFixed(2)}`}
            icon="dollar"
            color="purple"
          />
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage your assigned deliveries
            </p>
          </div>
          
          <OrdersList 
            orders={orders} 
            onStatusUpdate={handleOrderStatusUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;