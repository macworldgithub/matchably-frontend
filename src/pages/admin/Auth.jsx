import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../../config";
import { AuthAdminLoginFunction } from "../../utils/auth";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
// import { useNavigate } from "react-router-dom";

const URL = config.BACKEND_URL;
export default function AuthAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true);
    console.log("Logging in with", { username, password });
    const res = await AuthAdminLoginFunction({ username, password });
    const { status, message } = res;
    if (status === "success") {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      window.location.href = "/admin/campaigns";
    } else if (status === "failed") {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-[100vh] scale-[0.8]">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <div className=" bg-[#121212] p-12 rounded-2xl shadow-2xl w-[450px] border border-gray-700">
        <h2 className="text-white text-2xl font-extrabold text-center mb-8 font-sans tracking-wide">
          Admin Panel
        </h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 border border-gray-600 text-lg font-mono"
          />
        </div>
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 border border-gray-600 text-lg font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>
        <button
          onClick={handleLogin}
          className={`cursom-pointer w-full ${
            loading ? "bg-[#636363]" : "bg-[#0600c2] hover:bg-blue-700"
          } transition-all duration-300 text-white p-2 rounded-lg font-semibold shadow-lg text-lg FontNoto`}
          loading={loading}
        >
          {loading ? "loading" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
