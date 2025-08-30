import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Plus, 
  Package, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Eye,
  MessageCircle,
  ShoppingBag,
  Leaf,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    totalViews: 0,
    totalOrders: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [listingsRes, ordersRes] = await Promise.all([
        axios.get('/api/waste/my-listings'),
        axios.get('/api/orders/my-orders')
      ]);

      const listings = listingsRes.data;
      const orders = ordersRes.data;

      // Calculate stats
      const totalViews = listings.reduce((sum, listing) => sum + (listing.views || 0), 0);
      const totalEarnings = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingEarnings = orders
        .filter(order => ['confirmed', 'picked_up'].includes(order.status))
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalListings: listings.length,
        activeListings: listings.filter(l => l.availability.status === 'available').length,
        totalEarnings,
        pendingEarnings,
        totalViews,
        totalOrders: orders.length
      });

      setRecentListings(listings.slice(0, 4));
      setRecentOrders(orders.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add Waste Material',
      description: 'List new agricultural waste',
      icon: Plus,
      to: '/farmer/add-waste',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'My Listings',
      description: 'Manage your waste listings',
      icon: Package,
      to: '/farmer/listings',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Earnings',
      description: 'Track your income',
      icon: DollarSign,
      to: '/farmer/earnings',
      color: 'bg-purple-500 hover:bg-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Impact Dashboard',
      description: 'View environmental impact',
      icon: BarChart3,
      to: '/farmer/impact',
      color: 'bg-orange-500 hover:bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${stats.activeListings} active`
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `₹${stats.pendingEarnings} pending`
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'All listings'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Total orders'
    }
  ];

  const getWasteTypeIcon = (type) => {
    const icons = {
      'coconut_shell': '🥥',
      'rice_husk': '🌾',
      'sugarcane_stalk': '🎋',
      'corn_husk': '🌽',
      'wheat_straw': '🌾',
      'cotton_stalk': '🌿'
    };
    return icons[type] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'booked': 'bg-yellow-100 text-yellow-800',
      'sold': 'bg-gray-100 text-gray-800',
      'pending': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'picked_up': 'bg-purple-100 text-purple-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👨‍🌾
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your agricultural waste listings and track your impact
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-emerald-600">
              <Leaf className="w-6 h-6" />
              <span className="font-medium">Farmer Dashboard</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ title, value, icon: Icon, color, bgColor, change }) => (
            <div key={title} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-xs text-gray-500 mt-1">{change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Get started with these common tasks</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(({ title, description, icon: Icon, to, color, iconBg, iconColor }) => (
                <Link
                  key={title}
                  to={to}
                  className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-3 ${iconBg} rounded-lg inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Listings</h2>
                  <Link to="/farmer/listings" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentListings.length > 0 ? (
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div key={listing._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{getWasteTypeIcon(listing.wasteType)}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                          <p className="text-sm text-gray-600">
                            {listing.quantity.amount} {listing.quantity.unit} • ₹{listing.price.amount}/{listing.quantity.unit}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.availability.status)}`}>
                            {listing.availability.status}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="w-3 h-3 mr-1" />
                            {listing.views || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first waste material listing</p>
                    <Link
                      to="/farmer/add-waste"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Waste Material
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link to="/farmer/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {order.creator.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{order.wasteListing.title}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>₹{order.totalAmount}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500 text-sm">Orders from creators will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;