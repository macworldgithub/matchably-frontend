/** @format */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
  Outlet,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";
import axios from "axios";
import { Calendar1, LoaderCircle } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Coins,
  Gift,
  FileCheck,
  BookText,
  ScrollText,
  Receipt,
  ListChecks,
  CheckCircle,
  LogOut,
  Package,
} from "lucide-react";

// Pages
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import CampaignList from "./pages/campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import AboutUs from "./pages/AboutUs";
import Influencer from "./pages/influencer";
import BrandLandingPage from "./pages/BrandLandingPage";
import BrandAuth from "./pages/BrandAuth";
import BrandSignup from "./pages/BrandSignup";
import BrandForgetPass from "./pages/BrandForgetPass";
import ChooseRole from "./pages/ChooseRole";
import RewardsPage from "./pages/RewardsPage";
import TermsofService from "./pages/TermsofService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DonotSell from "./pages/DonotSell";
import PriceBrand from "./pages/BrandPrice";

// Mall Pages
import Mall from "./pages/Mall";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";

// Mall Admin Pages
import MallAdminLayout from "./pages/admin/mall/MallAdminLayout";
import Products from "./pages/admin/mall/Products";
import Orders from "./pages/admin/mall/Orders";
import AffiliateSales from "./pages/admin/mall/AffiliateSales";
import CommissionManagement from "./pages/admin/mall/CommissionManagement";
import CouponCodes from "./pages/admin/mall/CouponCodes";

// User Protected
import MyAccount from "./pages/myaccount";
import UserApplyCampaign from "./pages/userapplycampaign";
import Invitations from "./pages/Invitations";
import ReferralRewards from "./pages/Referral&Rewards";
import AddPostUrl from "./pages/addposturl";

// Admin Pages
import AuthAdmin from "./pages/admin/Auth";
import CampaignManagement from "./pages/admin/campainManagement";
import Applications from "./pages/admin/Applications";
import ViewCampaignApplicants from "./pages/admin/CampaignApplications";
import ViewCampaignSubmission from "./pages/admin/CampaignSubmission";
import ReferralLogs from "./pages/admin/ReferralLogs";
import ManualPointAdjust from "./pages/admin/ManualPointAdjust";
import RewardRedemptionManager from "./pages/admin/RewardRedemptionManager";
import PendingBrands from "./pages/admin/brands/PendingBrands";
import PlanManagement from "./pages/admin/PlanManagement";
import BrandPlanManagement from "./pages/admin/BrandPlanManagement";
import BillingLogs from "./pages/admin/BillingLogs";
import TrackingInfo from "./pages/admin/TrackingInfo";
import AdminCampaignApprove from "./pages/AdminCampaignApprove";
import CreatorAccessRequests from "./pages/admin/CreatorAccessRequests";
import ApprovedContentManagement from "./pages/admin/ApprovedContentManagement";
import NewRewardSystem from "./pages/admin/NewRewardSystem";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BrandSidebarLayout from "./components/brand/BrandSidebarLayout";

// Auth Store
import useAuthStore from "./state/atoms";
import config from "./config";
import OnboardingFlow from "./pages/OnboardingFlow";
import TikTokCallback from "./pages/TikTokCallback";
import InstagramCallback from "./pages/InstagramCallback";
import RecommendationsLayout from "./pages/admin/RecommendationsLayout";
import RecommendationsList from "./pages/admin/RecommendationsList";
import SubmissionDelays from "./pages/admin/SubmissionDelays";
import RecommendationSettings from "./pages/admin/RecommendationSettings";
import ExclusionsWhitelist from "./pages/admin/ExclusionsWhitelist";
import TikTokManagement from "./pages/admin/TikTokManagement";
import BrandSocialLinks from "./pages/BrandSocialLinks";

const URL = config.BACKEND_URL;

function Layout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBrandRoute =
    location.pathname.startsWith("/brand") &&
    !location.pathname.startsWith("/brand-auth") &&
    !location.pathname.startsWith("/brand-signup") &&
    !location.pathname.startsWith("/brand-price");

  const authStore = useAuthStore();
  const isLogin = !isAdminRoute && !isBrandRoute ? authStore.isLogin : null;
  const User = !isAdminRoute && !isBrandRoute ? authStore.User : null;
  const verifyLogin =
    !isAdminRoute && !isBrandRoute ? authStore.verifyLogin : null;

  useEffect(() => {
    if (!isAdminRoute && !isBrandRoute && verifyLogin) {
      verifyLogin().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAdminRoute, isBrandRoute, verifyLogin]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin text-gray-200" size={48} />
      </div>
    );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        limit={3}
      />
      {!isAdminRoute && !isBrandRoute && <Navbar Islogin={isLogin} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/auth/tiktok/callback" element={<TikTokCallback />} />
        <Route
          path="/auth/instagram/callback"
          element={<InstagramCallback />}
        />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route
          path="/campaigns/gifted"
          element={<CampaignList type="gifted" />}
        />
        <Route path="/campaigns/paid" element={<CampaignList type="paid" />} />
        <Route path="/campaign/:campaignId" element={<CampaignDetail />} />
        <Route
          path="/forbrand"
          element={
            <BrandAuthChecker>
              <BrandLandingPage />
            </BrandAuthChecker>
          }
        />
        <Route path="/influencer" element={<Influencer />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/rewards&affiliation" element={<RewardsPage />} />
        <Route path="/terms-of-service" element={<TermsofService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/do-not-sell-my-info" element={<DonotSell />} />

        {/* Mall Routes */}
        <Route path="/mall" element={<Mall />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/complete" element={<OrderComplete />} />

        {/* Brand Auth Routes */}
        <Route path="/brand-auth" element={<BrandAuth />} />
        <Route path="/brand-signup" element={<BrandSignup />} />
        <Route path="/forgot-password-brand" element={<BrandForgetPass />} />
        {/* Brand Price Route */}
        <Route
          path="/brand-price"
          element={
            <BrandAuthChecker>
              <PriceBrand />
            </BrandAuthChecker>
          }
        />
        <Route path="/social-links" element={<BrandSocialLinks />} />
        {/* Protected Brand Dashboard */}
        <Route
          path="/brand/*"
          element={
            <BrandAuthChecker>
              <BrandSidebarLayout />
            </BrandAuthChecker>
          }
        />

        {/* User Auth Routes */}
        <Route
          path="/UserApplyCampaign"
          element={
            <AuthChecker isLogin={isLogin}>
              <UserApplyCampaign />
            </AuthChecker>
          }
        />
        <Route
          path="/Invitations"
          element={
            <AuthChecker isLogin={isLogin}>
              <Invitations />
            </AuthChecker>
          }
        />
        <Route
          path="/referral&rewards"
          element={
            <AuthChecker isLogin={isLogin}>
              <ReferralRewards />
            </AuthChecker>
          }
        />
        <Route
          path="/AddPostUrl/:campaignId"
          element={
            <AuthChecker isLogin={isLogin}>
              <AddPostUrl />
            </AuthChecker>
          }
        />
        <Route
          path="/myaccount"
          element={
            <AuthChecker isLogin={isLogin}>
              <MyAccount user={User} campaigns={[]} />
            </AuthChecker>
          }
        />

        {/* Admin Auth */}
        <Route path="/admin/auth" element={<AuthAdmin />} />

        <Route
          path="/admin"
          element={
            <AdminAuthChecker>
              <AdminLayout />
            </AdminAuthChecker>
          }
        >
          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="users" element={<Applications />} />
          <Route
            path="applicants/:campaignId"
            element={<ViewCampaignApplicants />}
          />
          <Route
            path="campaign-submission/:campaignId/:email"
            element={<ViewCampaignSubmission />}
          />
          <Route path="referrals" element={<ReferralLogs />} />
          <Route
            path="approved-content/manage"
            element={<ManualPointAdjust />}
          />
          <Route path="rewards" element={<RewardRedemptionManager />} />
          <Route path="brands/pending" element={<PendingBrands />} />
          <Route path="plans" element={<PlanManagement />} />
          <Route
            path="brand-plan-management"
            element={<BrandPlanManagement />}
          />
          <Route path="billing-logs" element={<BillingLogs />} />
          <Route path="tracking-info" element={<TrackingInfo />} />
          <Route
            path="brandcampaign-approved"
            element={<AdminCampaignApprove />}
          />
          <Route
            path="creator-access-requests"
            element={<CreatorAccessRequests />}
          />
          <Route path="submission-delays" element={<SubmissionDelays />} />
          <Route path="tiktok" element={<TikTokManagement />} />
          <Route
            path="approved-content"
            element={<ApprovedContentManagement />}
          />
          {/* <Route path="new-reward-system" element={<NewRewardSystem />} /> */}

          {/* Recommendations Module */}
          <Route path="recommendations" element={<RecommendationsLayout />}>
            <Route index element={<RecommendationsList />} />
            <Route path="settings" element={<RecommendationSettings />} />
            <Route
              path="exclusions-whitelist"
              element={<ExclusionsWhitelist />}
            />
          </Route>
        </Route>

        {/* Mall Admin Routes */}
        <Route
          path="/admin/mall"
          element={
            <AdminAuthChecker>
              <MallAdminLayout />
            </AdminAuthChecker>
          }
        >
          <Route index element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="affiliate-sales" element={<AffiliateSales />} />
          <Route
            path="commission-management"
            element={<CommissionManagement />}
          />
          <Route path="coupon-codes" element={<CouponCodes />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isBrandRoute && <Footer />}

      {/* Removed old conditional admin layout - now using AdminLayout component */}
    </>
  );
}

function SidebarLink({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
        active
          ? "bg-[#2a2a2a] text-white border-l-4 border-lime-400"
          : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function AuthChecker({ children, isLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if no token exists at all
    const token = Cookie.get("token") || localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // If token exists, allow access even if isLogin is still being verified
  const token = Cookie.get("token") || localStorage.getItem("token");
  if (!token && !isLogin) {
    return null;
  }

  return <>{children}</>;
}

function AdminAuthChecker({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function verifyLogin() {
      try {
        const token = Cookie.get("AdminToken");
        const res = await axios.get(`${URL}/admin/verify`, {
          headers: { authorization: token },
        });
        if (res.data.status === "success") return setLoading(false);
        navigate("/admin/auth");
      } catch {
        navigate("/admin/auth");
      }
    }
    verifyLogin();
  }, []);
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin text-gray-200" size={48} />
      </div>
    );
  return <>{children}</>;
}

function BrandAuthChecker({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const setBrand = useAuthStore.getState().setBrand; // get setBrand outside async function or inside

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const token = localStorage.getItem("BRAND_TOKEN");
        if (!token) throw new Error("Missing brand token");

        const res = await axios.get(`${URL}/api/brand/auth/verify`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setLoading(false);
          setBrand(res.data.brand); // Set brand data in the store
        } else {
          navigate("/brand-auth");
        }
      } catch (err) {
        console.error(
          "Brand verify failed:",
          err?.response?.data || err.message
        );
        navigate("/brand-auth");
      }
    };

    verifyLogin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin text-gray-200" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}

function AdminLayout() {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    Cookie.remove("AdminToken");
    window.location.href = "/admin/auth";
  };

  const switchToMallAdmin = () => {
    // Store the current mode in localStorage
    localStorage.setItem("admin_mode", "mall");
    navigate("/admin/mall/products");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#141414] text-white">
      {/* Sidebar */}
      <aside className="bg-[#1f1f1f] p-4 w-full md:w-72 border-r border-gray-800 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Logo / Title */}
          <h1 className="text-xl font-bold text-center mb-6">
            Matchably Admin
          </h1>

          {/* Matchably Mall Button */}
          <button
            onClick={switchToMallAdmin}
            className="flex items-center gap-3 px-4 py-2 mb-6 rounded-lg bg-green-600 hover:bg-green-700 transition-all font-medium text-sm text-white"
          >
            <Package size={18} />
            Matchably Mall
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-6">
            {/* Campaigns Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Campaigns
              </h4>
              <SidebarLink
                to="/admin/campaigns"
                icon={<LayoutDashboard size={18} />}
                label="Campaigns"
              />
              <SidebarLink
                to="/admin/brandcampaign-approved"
                icon={<CheckCircle size={18} />}
                label="Campaign Approval"
              />
              <SidebarLink
                to="/admin/Users"
                icon={<Users size={18} />}
                label="Applications"
              />
            </div>

            {/* Tracking Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Tracking
              </h4>
              <SidebarLink
                to="/admin/tracking-info"
                icon={<ListChecks size={18} />}
                label="Tracking Info"
              />
            </div>

            {/* Users Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Users
              </h4>
              <SidebarLink
                to="/admin/approved-content/manage"
                icon={<Coins size={18} />}
                label="Approved Content"
              />
              <SidebarLink
                to="/admin/rewards"
                icon={<Gift size={18} />}
                label="Reward Redemptions"
              />
              {/* <SidebarLink
                to="/admin/new-reward-system"
                icon={<Gift size={18} />}
                label="New Reward System"
              /> */}
              <SidebarLink
                to="/admin/referrals"
                icon={<Gift size={18} />}
                label="Referral Logs"
              />
            </div>

            {/* Brands Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Brands
              </h4>
              <SidebarLink
                to="/admin/brands/pending"
                icon={<FileCheck size={18} />}
                label="Brand Applications"
              />
              <SidebarLink
                to="/admin/plans"
                icon={<BookText size={18} />}
                label="Brand Plans"
              />
              <SidebarLink
                to="/admin/brand-plan-management"
                icon={<ScrollText size={18} />}
                label="Brand Plan Management"
              />
              <SidebarLink
                to="/admin/billing-logs"
                icon={<Receipt size={18} />}
                label="Billing Logs"
              />
            </div>

            {/* Access Control Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Access Control
              </h4>
              <SidebarLink
                to="/admin/creator-access-requests"
                icon={<Users size={18} />}
                label="Creator Access Requests"
              />
            </div>

            <div className="space-y-2">
              <SidebarLink
                to="/admin/submission-delays"
                icon={<Calendar1 size={18} />}
                label="Submission Delays"
              />
            </div>

            {/* Social Media Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Social Media
              </h4>
              <SidebarLink
                to="/admin/tiktok"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
                  </svg>
                }
                label="TikTok Management"
              />
            </div>

            {/* Recommendations Section (New) */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Recommendations
              </h4>
              <SidebarLink
                to="/admin/recommendations"
                icon={<LayoutDashboard size={18} />}
                label="Recommendations"
              />
            </div>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-3 px-4 py-2 mt-6 rounded-lg text-red-400 hover:bg-[#2a2a2a] hover:text-red-500 transition font-medium text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#141414] p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
