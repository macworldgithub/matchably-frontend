import { Link } from "react-router-dom";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HomeActive from "../components/HomeActive";
import BrandLogoCarousel from "../components/BrandLogoCarousel";
import WhyBrandsLoveMatchably from "../components/WhyBrandsLoveMatchably";
import HowItWorks from "../components/HowItWorks";
import CampaignReportPreview from "../components/CampaignReportPreview";
import BrandExamplesShowcase from "../components/BrandExamplesShowcase";
import FinalCTA from "../components/FinalCTA";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import VideoSection from "../components/VideoSection";
import { Helmet } from "react-helmet";
import Devider from "../components/Devider";
import useAuthStore from "../state/atoms"; // ✅ import zustand auth store
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLogin } = useAuthStore(); // ✅ access login state
  const navigate = useNavigate();

  const handleMoreCampaignsClick = () => {
    if (isLogin) {
      navigate('/campaigns');
    } else {
      navigate('/signin');
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/active`
        );
        if (res.data.status === "success") {
          setDetail(res.data.campaigns);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="bg-black">
       <Helmet>
        <title>Matchably - Connect Brands with Creators for Authentic UGC</title>
        <meta property="og:title" content="Matchably - Connect Brands with Creators for Authentic UGC" />
        <meta
          name="description"
          content="For Creators: Get free products and get rewarded for your content. For Brands: Connect with real creators who deliver authentic UGC on autopilot."
        />
      </Helmet>

      <HeroSection />
      <Devider />

      {/* Brand-focused sections */}
      <BrandLogoCarousel />
      <Devider />

      <WhyBrandsLoveMatchably />
      <Devider />

      <HowItWorks />
      <Devider />

      <CampaignReportPreview />
      <Devider />

      <BrandExamplesShowcase />
      <Devider />

      {/* Creator-focused sections */}
      {/* <div className="w-full bg-[var(--background)] flex justify-center items-center flex-col pb-10">
        <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
          Get Free Products in 3 Steps
        </h1>
        <FeatureSection />
      </div>

      <Devider /> */}

      {/* {(loading || detail.length > 0) && (
        <div className="w-full bg-gradient-to-r from-black to-[#080012] flex flex-col items-center pb-10">
          <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
            Open for You
          </h1>
          <HomeActive detail={detail.slice(0, 3)} loading={loading} />
          {!isLogin && (
            <p className="text-sm text-gray-400 mt-7">
              Sign up to see all available campaigns.
            </p>
          )}
          <button
  onClick={handleMoreCampaignsClick}
  className="mt-5 px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
>
  More Campaigns
</button>

        </div>
      )} */}

      {/* <Devider /> */}

      {/* Creator Video Section */}
      {/* <div className="w-full min-h-[100vh] bg-gradient-to-r from-black to-[#080012] flex justify-center items-center flex-col pb-10">
        <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
          Work With Us
        </h1>
        <VideoSection />
      </div> */}
{/* 
      <Devider /> */}
 
      {/* Brand-focused Final CTA */}
      <FinalCTA />

      <div className="bg-gradient-to-r from-black to-[#040014] text-white">
        <Devider />
      </div>
    </div>
  );
}