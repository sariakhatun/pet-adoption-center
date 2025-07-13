import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';

let axiosSecure = axios.create({
    baseURL:`http://localhost:5000`
})

const useAxiosSecure = () => {
    let {user}=useAuth();
    
    axiosSecure.interceptors.request.use(async(config)=>{
        const token = await user.getIdToken();  // force refresh to get latest token

        config.headers.Authorization = `Bearer ${token}`
        return config;
    },error=>{
        return Promise.reject(error);
    })
    return axiosSecure;
};

export default useAxiosSecure;