/** @format */

import axios from "axios";
import { create } from "zustand";
import Cookie from "js-cookie";
import config from "../config";
import { User } from "lucide-react";

const BACKEND_URL = config.BACKEND_URL;

const useAuthStore = create((set) => ({
  isLogin: false,
  User: {},
  verifyLogin: async () => {
    try {
      // Token check
      if (Cookie.get("token") === "undefined" || !Cookie.get("token")) {
        Cookie.remove("token");
        set({ isLogin: false });
        return;
      }

      const token = Cookie.get("token") || localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/auth/verify`, {
        headers: {
          Authorization: token, // ✅ capital A
        },
      });

      console.log(res.data);
      set({ isLogin: res.data.status === "success" });

      if (res.data.status === "success") {
        const user = res.data.user;
        set({ User: user });

        // Ensure cookies are in sync
        Cookie.set("token", token, { expires: 7 }); // Set for 7 days

        // ✅ Redirect only if we're NOT already on onboarding
        const currentPath = window.location.pathname + window.location.search;

        // if (
        //   (!user.submittedUrls || user.submittedUrls.length < 3) &&
        //   !currentPath.startsWith("/onboarding")
        // ) {
        //   window.location.replace("/onboarding");
        //   return;
        // }
      }
    } catch (err) {
      console.error("verifyLogin failed:", err);
      set({ isLogin: false });
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
    // Ensure we have the user logged in state when user data is set
    const token = Cookie.get("token") || localStorage.getItem("token");
    if (token) {
      Cookie.set("token", token, { expires: 7 });
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
      Campaigns: [...state.Campaigns, ...compaigns], // Correctly refer to the state
    }));
  },
}));

export { useCompaign };
export default useAuthStore;
