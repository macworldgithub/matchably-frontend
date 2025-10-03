import { useNavigate } from "react-router-dom";

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Influencer Card */}
        <div
          onClick={() => navigate("/signin")}
          className="cursor-pointer rounded-2xl p-8 bg-gradient-to-tr from-purple-700 to-purple-900 shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <h2 className="text-3xl font-bold mb-4">I'm an Influencer</h2>
          <p className="text-gray-300 mb-6">
            Join exciting campaigns, earn rewards, and grow your audience with top brands.
          </p>
          <div className="mt-auto text-right">
            <span className="text-sm text-purple-300">Click to continue →</span>
          </div>
        </div>

        {/* Brand Card */}
        <div
          onClick={() => navigate("/brand-auth")}
          className="cursor-pointer rounded-2xl p-8 bg-gradient-to-tr from-indigo-700 to-indigo-900 shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <h2 className="text-3xl font-bold mb-4">I'm a Brand</h2>
          <p className="text-gray-300 mb-6">
            Run influencer campaigns, monitor performance, and expand your brand’s reach
          </p>
          <div className="mt-auto text-right">
            <span className="text-sm text-indigo-300">Click to continue →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
