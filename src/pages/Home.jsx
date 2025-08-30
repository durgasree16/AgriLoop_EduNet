import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Users, Recycle, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { icon: Recycle, label: 'Waste Materials Listed', value: '2,450+', color: 'text-emerald-600' },
    { icon: Users, label: 'Active Farmers', value: '850+', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Tons CO₂ Saved', value: '340+', color: 'text-purple-600' },
    { icon: Leaf, label: 'Creative Products Made', value: '1,280+', color: 'text-orange-600' }
  ];

  const features = [
    {
      title: 'Smart Waste Classification',
      description: 'AI-powered identification of agricultural waste types with pricing recommendations',
      icon: '🤖'
    },
    {
      title: 'Geo-Based Matching',
      description: 'Connect with nearby farmers and creators to reduce transportation costs',
      icon: '📍'
    },
    {
      title: 'Impact Tracking',
      description: 'Monitor your environmental impact and earnings in real-time',
      icon: '📊'
    },
    {
      title: 'Secure Transactions',
      description: 'Safe payment processing with escrow protection for all parties',
      icon: '🔒'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-emerald-100 rounded-full">
                <Leaf className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming
              <span className="text-emerald-600 block">Agricultural Waste</span>
              into Creative Economy
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect farmers with creators to turn agricultural residues into valuable products. 
              Earn extra income, reduce waste burning, and build a sustainable future together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-8 py-4 text-lg font-medium text-emerald-600 bg-white border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                  >
                    Browse Materials
                  </Link>
                </>
              ) : (
                <Link
                  to={user?.role === 'farmer' ? '/farmer/dashboard' : '/creator/dashboard'}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Icon className={`h-8 w-8 ${color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgriLoop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform bridges the gap between agricultural waste and creative innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AgriLoop Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to transform waste into value</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Farmer Step */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Farmers List Waste</h3>
              <p className="text-gray-600 mb-6">
                Upload photos of agricultural residues. Our AI identifies the material type and suggests pricing.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                  Coconut shells & husks
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                  Rice & wheat straw
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                  Sugarcane stalks
                </div>
              </div>
            </div>

            {/* Creator Step */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Creators Browse & Buy</h3>
              <p className="text-gray-600 mb-6">
                Discover sustainable materials nearby. Chat with farmers and arrange pickup or delivery.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Eco-friendly crafts
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Sustainable packaging
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Upcycled furniture
                </div>
              </div>
            </div>

            {/* Impact Step */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Track Impact Together</h3>
              <p className="text-gray-600 mb-6">
                Monitor earnings, CO₂ savings, and waste diverted from burning. Share your success stories!
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Real-time impact metrics
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Earnings dashboard
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Success showcase
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Waste into Value?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of farmers and creators building a sustainable future
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-emerald-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Start as Farmer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-emerald-700 border-2 border-white rounded-lg hover:bg-emerald-800 transition-colors shadow-lg"
              >
                Start as Creator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;