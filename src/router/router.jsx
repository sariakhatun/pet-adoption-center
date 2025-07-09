
import Dashboard from "@/dashboard/Dashboard";
import AddAPet from "@/dashboard/UserDashboard/AddAPet";
import AdoptionRequest from "@/dashboard/UserDashboard/AdoptionRequest";
import CreateDonationCampaign from "@/dashboard/UserDashboard/CreateDonationCampaign";
import MyDonation from "@/dashboard/UserDashboard/MyDonation";
import MyDonationCampaigns from "@/dashboard/UserDashboard/MyDonationCampaigns";
import MyPets from "@/dashboard/UserDashboard/MyPets";
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
         {
            path:'/dashboard',
            Component:Dashboard,
            children:[
              {
                path:'add-pet',
                Component:AddAPet
              },
              {
                path:'my-pets',
                Component:MyPets
              },
              {
                path:'adoption-requests',
                Component:AdoptionRequest
              },
              {
                path:'create-campaign',
                Component:CreateDonationCampaign
              },
              {
                path:'my-campaigns',
                Component:MyDonationCampaigns
              },
              {
                path:'my-donations',
                Component:MyDonation
              },
            ]
        },
    ]
  },
 
]);