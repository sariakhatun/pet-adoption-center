import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router";
import AdoptionRequestSkeleton from "@/skeleton/AdoptionRequestSkeleton";

const PrivateRoute = ({children}) => {
  let { user, loading } = useAuth();
  let location = useLocation();
  if (loading) {
    return <AdoptionRequestSkeleton></AdoptionRequestSkeleton>
     
    
  }
  if(!user){
   return <Navigate state={{from:location.pathname}} to='/login'></Navigate>
  }
  return children;
};

export default PrivateRoute;
