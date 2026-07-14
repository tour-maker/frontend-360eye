import { useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { FaPhoneAlt, FaEnvelope, FaPaperPlane, FaMapMarkerAlt } from "react-icons/fa";
import text from "../../assets/360eye.svg";
import logo from "../../assets/360eye_logo.svg";
import logo1 from "../../assets/1.png";
import logo2 from "../../assets/2.png";
import logo3 from "../../assets/3.png";
import { submitEnquiry } from "../../services/contactService";

export default function MapComponent({ css }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "phone") {
      // keep digits only
      next = value.replace(/\D/g, "");
    }
    setFormData({ ...formData, [name]: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Show loading for minimum 1 second so user sees the progress
      await Promise.all([
        submitEnquiry({
          ...formData,
          recipients: [
            "connect@360eye.in",
            "viraj@360eye.in",
            "dhaval@360eye.in"
          ],
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      setFormData({ name: "", phone: "", email: "", message: "" });
      
      // Hide loading overlay first
      setIsSubmitting(false);
      
      // Then show success popup
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setIsSubmitting(false);
      alert("There was an error submitting your inquiry. Please try again.");
    }
  };

  // Note: Modal now closes only via the OK button.

  return (
    <div className={`flex flex-col items-center ${css || 'h-full'}`}>
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

      {/* Title */}
      <div className="pt-[4svh] sm:pt-[2svh] pb-3 sm:pb-4">
        <h1 className="text-center text-xl sm:text-2xl font-bold text-white">Contact Us</h1>
        <div className="w-16 h-1 bg-[#87BA3A] mx-auto mt-1 sm:mt-2 rounded-full"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 px-4 lg:px-8 w-full max-w-7xl mx-auto flex-1 mt-2 sm:mt-0">
        <div className="flex flex-col items-center lg:mr-8 w-full max-w-md flex-shrink-0">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl sm:rounded-3xl shadow-[0_0_15px_3px_rgba(128,187,15,0.35)] w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-[#87BA3A] text-sm sm:text-base w-full"
                onChange={handleChange}
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone"
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-[#87BA3A] text-sm sm:text-base w-full sm:w-1/2"
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel"
                  maxLength={15}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-[#87BA3A] text-sm sm:text-base w-full sm:w-1/2"
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="message"
                value={formData.message}
                placeholder="Message"
                className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-[#87BA3A] text-sm sm:text-base w-full min-h-[80px]"
                onChange={handleChange}
                required
              ></textarea>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 justify-center bg-[#87BA3A] hover:bg-[#7aaa2d] text-white px-4 py-2 rounded-lg mt-2 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto sm:self-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Submit
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="w-full py-3 sm:py-4">
            {/* Top Row - Phone + Email Icon */}
            <div className="flex gap-2 sm:gap-4 w-full mb-2 sm:mb-3">
              {/* Phone - Left Side */}
              <a
                href="https://wa.me/917096360360"
                className="flex-1 flex items-center bg-gray-900 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl
                          shadow-[0_0_10px_2px_rgba(128,187,15,0.3)] hover:bg-gray-800
                          transition-colors"
              >
                <FaPhoneAlt className="text-[#87BA3A] text-xs sm:text-base mr-2 sm:mr-3" />
                <span className="text-white text-xs sm:text-sm truncate">+91 7096 360 360</span>
              </a>

              {/* Email Icon - Right Side */}
              <a
                href="mailto:contact@360eye.in"
                className="w-[30%] flex items-center justify-center bg-gray-900 rounded-lg sm:rounded-2xl
                          shadow-[0_0_10px_2px_rgba(128,187,15,0.3)] hover:bg-gray-800
                          transition-colors"
              >
                <FaEnvelope className="text-[#87BA3A] text-sm sm:text-xl" />
              </a>
            </div>

            {/* Address - Full Width Bottom */}
            <a
              href="https://maps.google.com?q=503 - Union Heights, Maharana Pratap Rd, beside Lalbhai Contractor Stadium, near Rahul Raj Mall, Piplod, Surat, Gujarat 395007"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-start lg:hidden bg-gray-900 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl shadow-[0_0_10px_2px_rgba(128,187,15,0.3)] hover:bg-gray-800 transition-colors"
            >
              <FaMapMarkerAlt className="text-[#87BA3A] text-sm sm:text-lg mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-white text-xs sm:text-sm">
                503 - Union Heights, Maharana Pratap Rd, Surat, Gujarat 395007
              </span>
            </a>
          </div>

          <div className="w-full mt-4 sm:mt-6 flex flex-row items-center justify-center">
            {/* Left Side: Logo */}
            <img src={logo} className="w-12 sm:w-16 lg:w-20" alt="Logo" />

            {/* Right Side: Text & Social Icons */}
            <div className="flex flex-col items-start">
              {/* Company Name */}
              <img src={text} className="w-24 sm:w-28 lg:w-36" alt="360eye" />

              {/* Social Media Icons */}
              <div className="flex gap-3 mt-1 sm:mt-2">
                <a href="https://www.facebook.com/360eye.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src={logo1} className="w-6 sm:w-7 lg:w-8" alt="Facebook" />
                </a>
                <a href="https://www.instagram.com/360eye.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src={logo2} className="w-6 sm:w-7 lg:w-8" alt="Instagram" />
                </a>
                <a href="https://www.youtube.com/c/360EYE" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src={logo3} className="w-6 sm:w-7 lg:w-8" alt="YouTube" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 sm:mt-6 text-gray-400 text-xs sm:text-sm text-center pb-16 lg:pb-4 safe-area-inset-bottom">
            &copy; {new Date().getFullYear()} 360EYE, All rights reserved.
          </div>
        </div>
      
        {/* Map Section - Only visible on LG+ screens */}
        <div className="w-full lg:w-auto flex flex-col items-center hidden lg:flex">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl sm:rounded-3xl shadow-[0_0_15px_3px_rgba(128,187,15,0.35)] w-[90%] lg:w-[400px] max-w-[500px] flex flex-col items-center">
            {/* Map Container */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.967199227102!2d72.7681394!3d21.1537036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d12bb37ec05%3A0x3f5fa29dedf47c99!2z4KSv4KWC4KSo4KS_4KSv4KSoIOCkueCkvuCkh-Ckn-CljeCkuA!5e0!3m2!1sen!2sen!4v1743408983706!5m2!1sen!2sen"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Open Map Button */}
            <a
              href="https://maps.app.goo.gl/DuTFjTQBjiGK9u929"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#87BA3A] text-white mt-4 px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Open in Google Maps
            </a>

            {/* Address at the Bottom */}
            <p className="text-gray-400 text-sm mt-4 text-center">
              503 - Union Heights, Maharana Pratap Rd, beside Lalbhai Contractor Stadium, near Rahul Raj Mall, Piplod, Surat, Gujarat 395007
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div
            className="bg-[#0f0f0f] border border-[#87BA3A] rounded-2xl shadow-[0_0_25px_4px_rgba(128,187,15,0.25)] px-6 py-5 sm:px-8 sm:py-7 mx-4 max-w-md w-[92%] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#87BA3A]/15 flex items-center justify-center">
                <FaCheckCircle className="text-[#87BA3A] text-2xl sm:text-3xl" />
              </div>
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">Submitted Successfully</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4">Thank you! Your inquiry has been submitted successfully. We will get back to you shortly.</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="inline-flex items-center justify-center bg-[#87BA3A] hover:bg-[#7aaa2d] text-white px-5 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
