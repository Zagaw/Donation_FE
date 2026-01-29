import React, { useState } from 'react';
import DonorLayout from './DonorLayout';
import { FaUpload, FaImage, FaCalendarAlt, FaExclamationCircle, FaTag, FaBox } from 'react-icons/fa';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    quantity: '',
    condition: 'new',
    description: '',
    pickupLocation: '',
    availableFrom: '',
    availableUntil: '',
    contactInfo: '',
    estimatedValue: ''
  });

  const categories = [
    { value: 'food', label: 'Food & Groceries', icon: '🍎', color: 'teal' },
    { value: 'clothing', label: 'Clothing', icon: '👕', color: 'indigo' },
    { value: 'medical', label: 'Medical Supplies', icon: '🏥', color: 'emerald' },
    { value: 'educational', label: 'Educational', icon: '📚', color: 'amber' },
    { value: 'shelter', label: 'Shelter Items', icon: '🏠', color: 'blue' },
    { value: 'other', label: 'Other', icon: '📦', color: 'gray' },
  ];

  const conditions = [
    { value: 'new', label: 'New', desc: 'Never used, with tags' },
    { value: 'like_new', label: 'Like New', desc: 'Gently used, excellent condition' },
    { value: 'good', label: 'Good', desc: 'Used, good working condition' },
    { value: 'fair', label: 'Fair', desc: 'Used, shows some wear' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Donation submitted:', formData);
    alert('Donation listed successfully!');
    setFormData({
      category: '',
      itemName: '',
      quantity: '',
      condition: 'new',
      description: '',
      pickupLocation: '',
      availableFrom: '',
      availableUntil: '',
      contactInfo: '',
      estimatedValue: ''
    });
  };

  return (
    <DonorLayout activePage="donation form">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Make a Donation</h1>
          <p className="text-gray-600">List items you want to donate to the community</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-800 mb-4">
                <FaExclamationCircle className="inline mr-2 text-teal-600" />
                Select Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      formData.category === cat.value 
                        ? `border-${cat.color}-500 bg-${cat.color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{cat.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Rice, Winter Jackets, Books"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 10 kg, 5 pieces, 3 boxes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTag className="inline mr-2 text-gray-400" />
                  Item Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label} - {cond.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Approximate value in dollars"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" />
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" />
                  Available Until
                </label>
                <input
                  type="date"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Address for pickup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information *
                </label>
                  <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Phone number or email"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Please provide details about the items, any special instructions, expiration dates (for food), size information (for clothing), etc..."
                required
              />
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUpload className="inline mr-2 text-gray-400" />
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                <FaImage className="text-gray-400 text-3xl mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload photos of your items</p>
                <label className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-teal-700 transition-colors">
                  Browse Photos
                  <input type="file" className="hidden" multiple accept="image/*" />
                </label>
                <p className="text-sm text-gray-500 mt-2">Max file size: 5MB. Supported: JPG, PNG</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center"
              >
                <FaBox className="mr-2" />
                List Donation
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines Section */}
        <div className="mt-8 bg-teal-50 rounded-xl p-6 border border-teal-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FaExclamationCircle className="text-teal-600 mr-2" />
            Donation Guidelines
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Food items should be non-perishable and unopened</li>
            <li>• Clothing should be clean and in good condition</li>
            <li>• Provide accurate quantity and condition information</li>
            <li>• Be clear about pickup location and availability</li>
            <li>• Update listing status once donated</li>
            <li>• Communicate promptly with requesters</li>
          </ul>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonationForm;