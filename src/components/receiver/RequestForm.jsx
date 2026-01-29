import React, { useState } from 'react';
import ReceiverLayout from './ReceiverLayout';
import { FaUpload, FaImage, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    quantity: '',
    urgency: 'medium',
    description: '',
    neededBy: '',
    location: '',
    contactInfo: ''
  });

  const categories = [
    { value: 'food', label: 'Food & Groceries', icon: '🍎', color: 'teal' },
    { value: 'clothing', label: 'Clothing', icon: '👕', color: 'indigo' },
    { value: 'medical', label: 'Medical Supplies', icon: '🏥', color: 'emerald' },
    { value: 'educational', label: 'Educational', icon: '📚', color: 'amber' },
    { value: 'shelter', label: 'Shelter Items', icon: '🏠', color: 'blue' },
    { value: 'other', label: 'Other', icon: '📦', color: 'gray' },
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
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Request submitted successfully!');
    // Reset form
    setFormData({
      category: '',
      itemName: '',
      quantity: '',
      urgency: 'medium',
      description: '',
      neededBy: '',
      location: '',
      contactInfo: ''
    });
  };

  return (
    <ReceiverLayout activePage="request form">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Assistance</h1>
          <p className="text-gray-600">Submit a request for items you need from the community</p>
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
              {/* Item Details */}
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
                  Quantity Needed *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 10 kg, 5 pieces"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" />
                  Needed By
                </label>
                <input
                  type="date"
                  name="neededBy"
                  value={formData.neededBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your address or pickup location"
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
                placeholder="Please provide details about your needs, specific requirements, and any other relevant information..."
                required
              />
            </div>

            {/* File Upload (Optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUpload className="inline mr-2 text-gray-400" />
                Upload Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                <FaImage className="text-gray-400 text-3xl mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop files here or</p>
                <label className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-teal-700 transition-colors">
                  Browse Files
                  <input type="file" className="hidden" multiple />
                </label>
                <p className="text-sm text-gray-500 mt-2">Max file size: 5MB. Supported: JPG, PNG, PDF</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-teal-50 rounded-xl p-6 border border-teal-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FaExclamationCircle className="text-teal-600 mr-2" />
            Tips for Better Requests
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Be specific about item details and quantities</li>
            <li>• Provide accurate location and contact information</li>
            <li>• Set realistic timelines for when you need items</li>
            <li>• Include clear descriptions and special requirements</li>
            <li>• Update your request status once received</li>
          </ul>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default RequestForm;