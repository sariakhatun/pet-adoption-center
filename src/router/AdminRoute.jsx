import useAuth from '@/hooks/useAuth';
import useUserRole from '@/hooks/useUserRole';
import React from 'react';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    let {user,loading}=useAuth();
    let {role,roleLoading}=useUserRole();

    if(loading || roleLoading){
        return '...loading'
    }

      if(!user || role!=='admin'){
        return <Navigate state={{from : location.pathname}} to='/forbidden'></Navigate>
    }

    return children
};

export default AdminRoute;