import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, DollarSign, Package, Info, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const AddWaste = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wasteType: '',
    condition: 'raw',
    quantity: {
      amount: '',
      unit: 'kg'
    },
    price: {
      amount: '',
      negotiable: true
    },
    location: {
      address: ''
    },
    specifications: {
      moistureContent: '',
      organicCertified: false,
      pesticideFree: false
    }
  });
  
  const [images, setImages] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const wasteTypes = [
    { value: 'coconut_shell', label: 'Coconut Shell', icon: '🥥' },
    { value: 'rice_husk', label: 'Rice Husk', icon: '🌾' },
    { value: 'sugarcane_stalk', label: 'Sugarcane Stalk', icon: '🎋' },
    { value: 'corn_husk', label: 'Corn Husk', icon: '🌽' },
    { value: 'wheat_straw', label: 'Wheat Straw', icon: '🌾' },
    { value: 'cotton_stalk', label: 'Cotton Stalk', icon: '🌿' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const units = ['kg', 'ton', 'bags', 'bundles'];
  const conditions = [
    { value: 'raw', label: 'Raw (as harvested)', description: 'Natural state with some moisture' },
    { value: 'cleaned', label: 'Cleaned', description: 'Dried and cleaned, ready to use' },
    { value: 'processed', label: 'Processed', description: 'Cut, chopped or partially processed' }
  ];

  // Simulate AI classification
  const classifyWaste = (filename) => {
    const wasteMapping = {
      'coconut': { type: 'coconut_shell', confidence: 0.95, price: 15 },
      'rice': { type: 'rice_husk', confidence: 0.92, price: 8 },
      'sugarcane': { type: 'sugarcane_stalk', confidence: 0.88, price: 12 },
      'corn': { type: 'corn_husk', confidence: 0.90, price: 10 },
      'wheat': { type: 'wheat_straw', confidence: 0.89, price: 7 },
      'cotton': { type: 'cotton_stalk', confidence: 0.85, price: 9 }
    };

    const name = filename.toLowerCase();
    for (const [key, value] of Object.entries(wasteMapping)) {
      if (name.includes(key)) {
        return value;
      }
    }
    return { type: 'other', confidence: 0.6, price: 10 };
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // AI Classification simulation
    const firstFile = files[0];
    const suggestion = classifyWaste(firstFile.name);
    setAiSuggestion(suggestion);
    
    if (!formData.wasteType) {
      setFormData(prev => ({
        ...prev,
        wasteType: suggestion.type,
        price: {
          ...prev.price,
          amount: suggestion.price.toString()
        }
      }));
    }

    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].url);
      return updated;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add images
      images.forEach(image => {
        submitData.append('images', image.file);
      });

      // Add other data
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('wasteType', formData.wasteType);
      submitData.append('condition', formData.condition);
      submitData.append('quantity', JSON.stringify(formData.quantity));
      submitData.append('price', JSON.stringify(formData.price));
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('specifications', JSON.stringify(formData.specifications));

      const response = await axios.post('/api/waste', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer/listings');
      }, 2000);

    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Created!</h2>
          <p className="text-gray-600 mb-4">Your waste material has been listed successfully.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">List Your Agricultural Waste</h1>
            <p className="text-gray-600 mt-1">Transform your farm waste into income</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Photos (Max 5)
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-400 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Photo</span>
                    </div>
                  </div>
                )}
              </div>

              {aiSuggestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">AI Detection Result</h4>
                      <p className="text-sm text-blue-700">
                        Detected: <strong>{wasteTypes.find(w => w.value === aiSuggestion.type)?.label}</strong>
                        {' '}(Confidence: {Math.round(aiSuggestion.confidence * 100)}%)
                      </p>
                      <p className="text-sm text-blue-700">
                        Suggested price: ₹{aiSuggestion.price}/kg
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Fresh Coconut Shells - 500kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waste Type *
                </label>
                <select
                  name="wasteType"
                  required
                  value={formData.wasteType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select waste type</option>
                  {wasteTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your waste material, harvest date, storage conditions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Quantity and Condition */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity.amount"
                  required
                  min="1"
                  value={formData.quantity.amount}
                  onChange={handleInputChange}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  name="quantity.unit"
                  required
                  value={formData.quantity.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per {formData.quantity.unit} (₹) *
                </label>
                <input
                  type="number"
                  name="price.amount"
                  required
                  min="1"
                  value={formData.price.amount}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Condition *
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {conditions.map(condition => (
                  <label key={condition.value} className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                    formData.condition === condition.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900">{condition.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{condition.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                Pickup Location *
              </label>
              <input
                type="text"
                name="location.address"
                required
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Village, Taluk, District, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details (Optional)</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    name="specifications.moistureContent"
                    min="0"
                    max="100"
                    value={formData.specifications.moistureContent}
                    onChange={handleInputChange}
                    placeholder="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="specifications.organicCertified"
                      checked={formData.specifications.organicCertified}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Organic Certified</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="specifications.pesticideFree"
                      checked={formData.specifications.pesticideFree}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pesticide Free</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="price.negotiable"
                      checked={formData.price.negotiable}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Price Negotiable</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/farmer/listings')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Create Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWaste;