
import HomeLayout from "@/layouts/HomeLayout/HomeLayout";
import GoogleLogin from "@/pages/Authentication/GoogleLogin";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
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
         {
            path:'/login',
            Component:Login
        },
         {
            path:'/register',
            Component:Register
        },
         {
            path:'/googleLogin',
            Component:GoogleLogin
        },
    ]
  },
 
]);