
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
import PrivateRoute from "./PrivateRoute";
import UpdatePet from "@/dashboard/UserDashboard/UpdatePet";
import EditDonationCampaign from "@/dashboard/UserDashboard/EditDonationCampaign";
import PetDetails from "@/pages/Authentication/PetDetails";
import DonationDetails from "@/pages/Authentication/DonationDetails";
import PetsByCategory from "@/pages/Home/Home/PetsByCategory";
import MakeAdmin from "@/dashboard/UserDashboard/MakeAdmin";
import AllPets from "@/dashboard/UserDashboard/AllPets";
import AllDonations from "@/dashboard/UserDashboard/AllDonations";

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
          path:'/pets/category/:category',
          element:<PetsByCategory></PetsByCategory>
        },
        {
            path:'/petListing',
            Component:PetListing,
        },
        {
            path:'/petDetails/:id',
            Component:PetDetails,
        },
        {
            path:'/donationCampaigns',
            Component:DonationCampaigns,
        },
        {
            path:"/donation-details/:id",
            Component:DonationDetails,
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
           element:<PrivateRoute>
            <Dashboard></Dashboard>
           </PrivateRoute>,
            children:[
              {
                path:'add-pet',
               element:<PrivateRoute>
                <AddAPet></AddAPet>
               </PrivateRoute>
              },
              {
                path:'my-pets',
                element:<PrivateRoute>
                  <MyPets></MyPets>
                </PrivateRoute>
              },
              {
                path:'adoption-requests',
                element:<PrivateRoute>
                  <AdoptionRequest></AdoptionRequest>
                </PrivateRoute>
              },
              {
                path:'create-campaign',
               element:<PrivateRoute>
                <CreateDonationCampaign></CreateDonationCampaign>
               </PrivateRoute>
              },
              {
                path:'my-campaigns',
               element:<PrivateRoute>
                <MyDonationCampaigns></MyDonationCampaigns>
               </PrivateRoute>
              },
              {
                path:'my-donations',
                element:<PrivateRoute>
                  <MyDonation></MyDonation>
                </PrivateRoute>
              },
              {
                path:'update-pet/:id',
                element:<PrivateRoute>
                  <UpdatePet></UpdatePet>
                </PrivateRoute>
              },
              {
                path:'edit-donation/:id',
                element:<PrivateRoute>
                  <EditDonationCampaign></EditDonationCampaign>
                </PrivateRoute>
              },
              // admin route
              {
                path:'make-admin',
                element:<PrivateRoute>
                  <MakeAdmin></MakeAdmin>
                </PrivateRoute>
              },
               {
                path:'all-pets',
                element:<PrivateRoute>
                  <AllPets></AllPets>
                </PrivateRoute>
              },
               {
                path:'all-donations',
                element:<PrivateRoute>
                  <AllDonations></AllDonations>
                </PrivateRoute>
              },
            ]
        },
    ]
  },
 
]);