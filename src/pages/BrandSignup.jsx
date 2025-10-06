import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { CheckCircle, X } from 'lucide-react'; // Icon library (if using Lucide)


export default function BrandSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    productCategory: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // prevent modal from re-appearing on refresh
    const shown = localStorage.getItem("brandSignupPopupShown");
    if (shown) {
      setShowModal(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/api/brand/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          productCategory: formData.productCategory,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'failed') {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      // Show modal once
      localStorage.setItem("brandSignupPopupShown", "true");
      setShowModal(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/social-links");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#ffffff1b] p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-center text-xl font-bold mb-6">Register Your Brand</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="companyName" placeholder="Your Company Name*" value={formData.companyName} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
          <input name="contactName" placeholder="Your Full Name*" value={formData.contactName} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
          <input name="email" type="email" placeholder="Business Email*" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
          <input name="website" placeholder="Company Website" value={formData.website} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input name="password" type="password" placeholder="Create a Password*" value={formData.password} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
          <input name="confirmPassword" type="password" placeholder="Confirm Your Password*" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
          <button type="submit" className="w-full bg-indigo-600 p-2 rounded disabled:opacity-50" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <a href="/brand-auth" className="text-indigo-400 underline">Sign In</a>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-4 text-white text-2xl hover:text-red-500 transition"
              aria-label="Close"
            >
              ✖
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-semibold mb-2">Registration Received!</h2>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Our team will review your application within <span className="text-indigo-400 font-medium">24 hours</span>.
          <br />You'll receive a confirmation email once your brand is approved.
              </p>
        <div className="text-yellow-300 text-lg mb-4">Thank you for joining <span className="font-bold text-white">Matchably</span>! 💼✨</div>
              <button
                onClick={handleCloseModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
