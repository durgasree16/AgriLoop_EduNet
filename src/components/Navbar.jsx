import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Leaf, User, LogOut, Plus, Package, DollarSign, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getFarmerMenuItems = () => [
    { icon: Plus, label: 'Add Waste', to: '/farmer/add-waste' },
    { icon: Package, label: 'My Listings', to: '/farmer/listings' },
    { icon: DollarSign, label: 'Earnings', to: '/farmer/earnings' },
    { icon: BarChart3, label: 'Impact', to: '/farmer/impact' }
  ];

  const getCreatorMenuItems = () => [
    { icon: Package, label: 'Browse Materials', to: '/creator/browse' },
    { icon: Package, label: 'My Orders', to: '/creator/orders' },
    { icon: BarChart3, label: 'Showcase', to: '/creator/showcase' },
    { icon: BarChart3, label: 'My Impact', to: '/creator/impact' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xl font-bold text-gray-800">AgriLoop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Browse Materials
            </Link>
            <Link to="/showcase" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Showcase
            </Link>
            <Link to="/impact" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Impact
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    
                    {user?.role === 'farmer' && getFarmerMenuItems().map(({ icon: Icon, label, to }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {label}
                      </Link>
                    ))}

                    {user?.role === 'creator' && getCreatorMenuItems().map(({ icon: Icon, label, to }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {label}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/browse"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Materials
              </Link>
              <Link
                to="/showcase"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Showcase
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 border-t border-gray-200 mt-2">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  </div>

                  {user?.role === 'farmer' && getFarmerMenuItems().map(({ icon: Icon, label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </Link>
                  ))}

                  {user?.role === 'creator' && getCreatorMenuItems().map(({ icon: Icon, label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-red-700 hover:text-red-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mx-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;