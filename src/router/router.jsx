import HomeLayout from "@/layouts/HomeLayout/HomeLayout";
import DonationCampaigns from "@/pages/DonationCampaigns/DonationCampaigns";
import Home from "@/pages/Home/Home/Home";
import PetListing from "@/pages/PetListing/PetListing";
import {
  createBrowserRouter,
} from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children:[
        {
            index:true,
            path:'/',
            Component:Home,
        },
        {
            path:'/petListing',
            Component:PetListing,
        },
        {
            path:'/donationCampaigns',
            Component:DonationCampaigns,
        },
    ]
  },
]);