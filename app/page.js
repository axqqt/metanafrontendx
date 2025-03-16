"use client"
import React, { useState } from 'react';

function App() {
  // Single URL configuration as requested
  const apiUrl = "https://metanaback-production.up.railway.app";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [cvLink, setCvLink] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      cv: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);
    setCvLink(null); // Reset CV link on new submission

    // Create FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("cv", formData.cv);

    // Log form data for debugging
    console.log("Form Data:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cv: formData.cv,
    });
    
    try {
      console.log(`Submitting to: ${apiUrl}/api/submit`);
      
      const response = await fetch(`${apiUrl}/api/submit`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setToast({
          type: 'success',
          message: 'Your application has been submitted successfully!'
        });
        setCvLink(data.cv_link); // Store the CV link
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          cv: null,
        });
        // Reset file input
        const fileInput = document.getElementById("cv");
        if (fileInput) fileInput.value = "";
      } else {
        setToast({
          type: 'error',
          message: 'There was an error submitting your application. Please try again later.'
        });
      }
    } catch (error) {
      console.error("Error with submission:", error);
      setToast({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Join Our Team</h1>
        
        {/* Toast Message */}
        {toast && (
          <div className={`mb-6 p-4 rounded-lg ${
            toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } flex items-center justify-between`}>
            <p className="font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="+1 (XXX) XXX-XXXX"
            />
          </div>

          {/* CV Upload Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload CV</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 48 48" 
                  aria-hidden="true"
                >
                  <path 
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label 
                    htmlFor="cv" 
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input 
                      id="cv" 
                      name="cv" 
                      type="file" 
                      accept=".pdf,.docx" 
                      onChange={handleFileChange} 
                      required 
                      className="sr-only" 
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                {formData.cv && (
                  <p className="text-sm text-green-600">
                    File selected: {formData.cv.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              isSubmitting 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>

        {/* CV Link Display */}
        {cvLink && (
          <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <p className="text-green-800 mb-2">
              Your CV has been uploaded successfully.
            </p>
            <a
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Uploaded CV
            </a>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        By submitting this application, you agree to our 
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> Terms of Service </a> 
        and 
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> Privacy Policy</a>.
      </p>
    </div>
  );
}

export default App;