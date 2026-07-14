import { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaPaperPlane, FaCheckCircle, FaTimes, FaSpinner } from "react-icons/fa";
import { submitEnquiry } from "../../services/contactService";

import text from "../../assets/360eye.svg";
import logo from "../../assets/360eye_logo.svg";
import logo1 from "../../assets/1.png";
import logo2 from "../../assets/2.png";
import logo3 from "../../assets/3.png";


export default function ContactUs({ css }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Submit handler for React events
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    console.log("Setting isSubmitting to true");
    setIsSubmitting(true);
    
    try {
      // Add recipient emails to the form data
      const submissionData = {
        ...formData,
        recipients: ["connect@360eye.in", "viraj@360eye.in", "dhaval@360eye.in"]
        
      };
      
      console.log("Submitting enquiry...");
      
      // Show loading for minimum 1 second so user sees the progress
      const [response] = await Promise.all([
        submitEnquiry(submissionData),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      console.log("Enquiry submitted successfully");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
      
      // Hide loading overlay first
      setIsSubmitting(false);
      
      // Then show success message
      setShowSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      alert("There was an error submitting your inquiry. Please try again.");
    }
  };
  
  return (
    <section className={`w-full flex flex-col items-center justify-center bg-black text-white p-4 ${css} relative`}>
      {/* Loading Overlay */}
      {isSubmitting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          role="status"
          aria-live="assertive"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#111] px-8 py-8 shadow-2xl border-2 border-[#87BA3A]">
            <FaSpinner className="animate-spin text-5xl text-[#87BA3A]" aria-hidden="true" />
            <p className="text-lg font-medium text-white">Sending your enquiry…</p>
            <p className="text-sm text-gray-400">Please wait</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          role="alert"
          aria-live="polite"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#111] px-8 py-8 shadow-2xl border-2 border-[#87BA3A] max-w-md mx-4">
            <FaCheckCircle className="text-5xl text-[#87BA3A]" />
            <p className="text-lg font-medium text-white text-center">Thank you!</p>
            <p className="text-sm text-gray-300 text-center">Your inquiry has been submitted successfully. We'll get back to you soon.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-2 px-6 py-2 bg-[#87BA3A] text-white rounded-md hover:bg-[#6fa82f] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {/* Contact Form */}
        <div className="w-full">
          {/* Title with consistent spacing */}
          <div className="w-full text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Contact Us</h2>
          </div>
          
          <div className="bg-[#111] p-4 sm:p-6 rounded-xl shadow-[0_0_15px_3px_rgba(128,187,15,0.35)]">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  placeholder="Full Name"
                  className={`bg-transparent border-b p-2 focus:outline-none w-full text-sm sm:text-base ${formErrors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="w-full">
                <input
                  type="tel"
                  name="phone"
                  id="contact-phone"
                  placeholder="Phone Number"
                  className={`bg-transparent border-b p-2 focus:outline-none w-full text-sm sm:text-base ${formErrors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  name="email"
                  id="contact-email"
                  placeholder="Email Address"
                  className={`bg-transparent border-b p-2 focus:outline-none w-full text-sm sm:text-base ${formErrors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {formErrors.email ? (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                ) : (
                  <p className="text-[#87BA3A] text-xs italic ml-1">A verification link will be sent to your email address</p>
                )}
              </div>
              
              <div className="w-full">
                <textarea
                  name="message"
                  id="contact-message"
                  placeholder="Your Message"
                  rows="4"
                  className={`bg-transparent border-b p-2 focus:outline-none w-full min-h-[80px] sm:min-h-[100px] text-sm sm:text-base ${formErrors.message ? 'border-red-500' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
              </div>
              
              <button 
                type="button"
                id="contact-submit-button"
                className={`flex items-center justify-center gap-2 text-[#87BA3A] px-4 py-2 rounded-md mt-1 sm:mt-2 w-full text-sm sm:text-base transition-colors ${isSubmitting ? 'bg-[#87BA3A]/10 cursor-wait' : 'hover:bg-[#87BA3A]/10'}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" aria-hidden="true" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm sm:text-base" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-full mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
          <a
            href="tel:+917096360360"
            className="flex items-center justify-center bg-[#111] p-2 sm:p-3 rounded-xl shadow-[0_0_15px_3px_rgba(128,187,15,0.35)] hover:scale-[1.02] transition-transform w-full text-sm sm:text-base"
          >
            <FaPhoneAlt className="text-[#87BA3A] mr-2 sm:mr-3 text-sm sm:text-base" /> 
            +91 7096 360 360
          </a>

          <a
            href="mailto:contact@360eye.in"
            className="flex items-center justify-center bg-[#111] p-2 sm:p-3 rounded-xl shadow-[0_0_15px_3px_rgba(128,187,15,0.35)] hover:scale-[1.02] transition-transform w-full text-sm sm:text-base"
          >
            <FaEnvelope className="text-[#87BA3A] mr-2 sm:mr-3 text-sm sm:text-base" /> 
            contact@360eye.in
          </a>
        </div>

        {/* Logo and Social Links */}
        <div className="w-full mt-5 sm:mt-8 flex flex-row items-center justify-center">
  {/* Left Side: Logo */}
  <img src={logo} className="w-16 sm:w-20" alt="Logo" />

  {/* Right Side: Text & Social Icons */}
  <div className="flex flex-col items-start">
    {/* Company Name */}
    <img src={text} className="w-28 sm:w-36" alt="360eye" />

    {/* Social Media Icons */}
    <div className="flex gap-2 mt-1 sm:mt-2">
  <a href="https://www.facebook.com/360eye.in" target="_blank" rel="noopener noreferrer">
    <img src={logo1} className="w-8 sm:w-8" alt="Facebook" />
  </a>
  <a href="https://www.instagram.com/360eye.in" target="_blank" rel="noopener noreferrer">
    <img src={logo2} className="w-8 sm:w-8" alt="Instagram" /> {/* Bigger size */}
  </a>
  <a href="https://www.youtube.com/c/360EYE" target="_blank" rel="noopener noreferrer">
    <img src={logo3} className="w-8 sm:w-8" alt="YouTube" />
  </a>
</div>

  </div>

  {/* Footer (Always Centered) */}

        </div>
        <footer className="w-full mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm text-center">
          &copy; {new Date().getFullYear()} 360EYE, All rights reserved.
        </footer>
      </div>


    </section>
  );
}