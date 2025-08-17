import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

let axiosSecure = axios.create({
    baseURL:`https://b11a12-server-side-sariakhatun.vercel.app/`
})

const useAxiosSecure = () => {
    let {user,logOut}=useAuth();
    let navigate = useNavigate();
    
    axiosSecure.interceptors.request.use(async(config)=>{
        const token = await user?.getIdToken?.(); 
       if(token){
         config.headers.Authorization = `Bearer ${token}`
       }
        return config;
    },error=>{
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res=>{
        return res;
    },error=>{
        console.log('inside response interceptor',error.status)
        let status = error.status;
        if(status === 403){
            navigate('/forbidden')
        }else if(status===401){
            logOut()
            .then(()=>{
            navigate('/login')

            })
            .catch(error=>{
                console.log(error)
            })
        }
        return Promise.reject(error)
    })


    return axiosSecure;
};

export default useAxiosSecure;