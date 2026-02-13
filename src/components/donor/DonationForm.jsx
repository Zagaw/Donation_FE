import React, { useState } from 'react';
import DonorLayout from './DonorLayout';
import { 
  FaUpload, 
  FaImage, 
  FaCalendarAlt, 
  FaExclamationCircle, 
  FaTag, 
  FaBox, 
  FaIdCard,
  FaCamera,
  FaTrash 
} from 'react-icons/fa';
import { api } from '../../api/api';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    description: '',
    category: '',
    nrcNumber: '',
    nrcFrontImage: null,
    nrcBackImage: null
  });

  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    back: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: 'Only JPG, JPEG, and PNG files are allowed' 
      }));
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: 'File size must be less than 2MB' 
      }));
      return;
    }

    // Clear any previous error
    setErrors(prev => ({ ...prev, [type]: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({
        ...prev,
        [type === 'nrcFrontImage' ? 'front' : 'back']: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Store file in form data
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const removeImage = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    
    setImagePreviews(prev => ({
      ...prev,
      [type === 'nrcFrontImage' ? 'front' : 'back']: null
    }));
    
    setErrors(prev => ({ ...prev, [type]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be a number greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('quantity', parseInt(formData.quantity));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      if (formData.nrcNumber) {
        formDataToSend.append('nrcNumber', formData.nrcNumber);
      }

      // Append image files if they exist
      if (formData.nrcFrontImage) {
        formDataToSend.append('nrcFrontImage', formData.nrcFrontImage);
      }

      if (formData.nrcBackImage) {
        formDataToSend.append('nrcBackImage', formData.nrcBackImage);
      }

      // Make API call
      const response = await api.donations.create(formDataToSend);

      if (response.status === 201) {
        alert('Donation created successfully!');
        
        // Reset form
        setFormData({
          itemName: '',
          quantity: '',
          description: '',
          category: '',
          nrcNumber: '',
          nrcFrontImage: null,
          nrcBackImage: null
        });
        
        setImagePreviews({
          front: null,
          back: null
        });
        
        setErrors({});
        
        // Optionally redirect to donations list
        // navigate('/donor/donations');
      }
    } catch (error) {
      console.error('Donation creation error:', error);
      
      if (error.response) {
        // Handle validation errors from Laravel
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          const formattedErrors = {};
          
          Object.keys(validationErrors).forEach(key => {
            formattedErrors[key] = validationErrors[key][0];
          });
          
          setErrors(formattedErrors);
        } else {
          setErrors({ submit: error.response.data?.message || 'Failed to create donation. Please try again.' });
        }
      } else if (error.request) {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DonorLayout activePage="donation form">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Make a Donation</h1>
          <p className="text-gray-600">List items you want to donate to the community</p>
        </div>

        {/* Display submit error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-800 mb-4">
                <FaExclamationCircle className="inline mr-2 text-teal-600" />
                Select Category *
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
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category}</p>
              )}
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
                  className={`w-full px-4 py-3 border ${
                    errors.itemName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  placeholder="e.g., Rice, Winter Jackets, Books"
                  disabled={isSubmitting}
                />
                {errors.itemName && (
                  <p className="mt-2 text-sm text-red-600">{errors.itemName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  placeholder="e.g., 10"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-sm text-gray-500">Enter the number of items</p>
                {errors.quantity && (
                  <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>
            </div>

            {/* NRC Information */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FaIdCard className="text-teal-600 mr-2" />
                NRC Information (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                For verification purposes. Providing NRC details helps build trust with recipients.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NRC Number
                </label>
                <input
                  type="text"
                  name="nrcNumber"
                  value={formData.nrcNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., 12/ABC(N)123456"
                  disabled={isSubmitting}
                />
              </div>

              {/* NRC Images Upload */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Front Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NRC Front Image
                  </label>
                  {imagePreviews.front ? (
                    <div className="relative">
                      <img 
                        src={imagePreviews.front} 
                        alt="NRC Front" 
                        className="w-full h-48 object-contain border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('nrcFrontImage')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer ${
                      errors.nrcFrontImage ? 'border-red-500' : ''
                    }`}>
                      <FaCamera className="text-gray-400 text-3xl mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload NRC Front Image</p>
                      <span className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm">
                        Choose File
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleImageUpload(e, 'nrcFrontImage')}
                          disabled={isSubmitting}
                        />
                      </span>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 2MB)</p>
                    </label>
                  )}
                  {errors.nrcFrontImage && (
                    <p className="mt-2 text-sm text-red-600">{errors.nrcFrontImage}</p>
                  )}
                </div>

                {/* Back Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NRC Back Image
                  </label>
                  {imagePreviews.back ? (
                    <div className="relative">
                      <img 
                        src={imagePreviews.back} 
                        alt="NRC Back" 
                        className="w-full h-48 object-contain border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('nrcBackImage')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer ${
                      errors.nrcBackImage ? 'border-red-500' : ''
                    }`}>
                      <FaCamera className="text-gray-400 text-3xl mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload NRC Back Image</p>
                      <span className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm">
                        Choose File
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleImageUpload(e, 'nrcBackImage')}
                          disabled={isSubmitting}
                        />
                      </span>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 2MB)</p>
                    </label>
                  )}
                  {errors.nrcBackImage && (
                    <p className="mt-2 text-sm text-red-600">{errors.nrcBackImage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Please provide details about the items, any special instructions, expiration dates (for food), size information (for clothing), etc..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-amber-500 ${
                  isSubmitting ? 'opacity-70' : 'hover:bg-amber-600 hover:-translate-y-1 hover:shadow-lg'
                } text-white px-8 py-3 rounded-lg font-medium text-lg transition-all flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Donation...
                  </>
                ) : (
                  <>
                    <FaBox className="mr-2" />
                    Create Donation
                  </>
                )}
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
            <li>• Provide accurate quantity information</li>
            <li>• NRC information is optional but helps build trust</li>
            <li>• Image files must be less than 2MB each</li>
            <li>• You will be notified when someone requests your donation</li>
          </ul>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonationForm;