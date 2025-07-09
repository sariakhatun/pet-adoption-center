
import { AuthContext } from '@/context/AuthContext/AuthContext';
import React, { use } from 'react';

const useAuth = () => {
    
    let authInfo = use(AuthContext)
    return authInfo;
};

export default useAuth;