import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react"

const PrivateRoute = ({children}) => {
  let { user, loading } = useAuth();
  let location = useLocation();
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-[#34B7A7]" />
    </div>
     
    );
  }
  if(!user){
   return <Navigate state={{from:location.pathname}} to='/login'></Navigate>
  }
  return children;
};

export default PrivateRoute;
