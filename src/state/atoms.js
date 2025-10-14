/** @format */

import axios from "axios";
import { create } from "zustand";
import config from "../config";

const BACKEND_URL = config.BACKEND_URL;

const useAuthStore = create((set) => ({
  isLogin: false,
  User: {},

  verifyLogin: async () => {
    console.log("Verifying login...");

    try {
      const token = localStorage.getItem("token");

      // Token validation
      if (!token || token === "undefined") {
        localStorage.removeItem("token");
        set({ isLogin: false });
        return;
      }

      console.log("TOKEN:", token);

      const res = await axios.get(`${BACKEND_URL}/auth/verify`, {
        headers: {
          Authorization: token, // ✅ Correct header
        },
      });

      console.log("Verify response:", res.data);

      if (res.data.status === "success") {
        const user = res.data.user;
        set({
          isLogin: true,
          User: user,
        });

        // ✅ Ensure token stays in localStorage
        localStorage.setItem("token", token);

        // Optional onboarding redirect logic
        // const currentPath = window.location.pathname + window.location.search;
        // if (
        //   (!user.submittedUrls || user.submittedUrls.length < 3) &&
        //   !currentPath.startsWith("/onboarding")
        // ) {
        //   window.location.replace("/onboarding");
        // }
      } else {
        set({ isLogin: false });
      }
    } catch (err) {
      console.error("verifyLogin failed:", err);
      set({ isLogin: false });
      localStorage.removeItem("token");
    }
  },

  setSignin: async (state) => {
    set({ isLogin: state });
  },

  setBrand: async (brand) => {
    set({ brand: brand });
  },

  setUser: (user) => {
    set({ User: user, isLogin: true });

    // ✅ Persist token if it exists
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  },
}));

const useCompaign = create((set) => ({
  Campaigns: [],

  setToEmpty: () => set({ Campaigns: [] }),

  EditCampaign: async (index, campaign) => {
    set((state) => {
      const updatedCampaigns = [...state.Campaigns];
      updatedCampaigns[index] = {
        ...updatedCampaigns[index],
        ...campaign,
      };
      return { Campaigns: updatedCampaigns };
    });
  },

  DeleteCampaign: async (index) => {
    set((state) => {
      const updatedCampaigns = [...state.Campaigns];
      updatedCampaigns.splice(index, 1);
      return { Campaigns: updatedCampaigns };
    });
  },

  AddCompaign: async ({
    campaignTitle,
    brandName,
    productDescription,
    contentFormat,
    requiredHashtags,
    influencersReceive,
    deadline,
    participationRequirements,
    productImage,
    id,
    brandLogo,
    productImages,
    recruiting,
    campaignIndustry,
  }) => {
    set((state) => ({
      Campaigns: [
        ...state.Campaigns,
        {
          campaignTitle,
          brandName,
          productDescription,
          contentFormat,
          requiredHashtags,
          influencersReceive,
          deadline,
          participationRequirements,
          productImage,
          brandLogo,
          productImages,
          recruiting,
          campaignIndustry,
          id,
        },
      ],
    }));
  },

  SetCompaigns: async (compaigns) => {
    console.log(compaigns);
    set((state) => ({
      Campaigns: [...state.Campaigns, ...compaigns],
    }));
  },
}));

export { useCompaign };
export default useAuthStore;
