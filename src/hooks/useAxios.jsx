import axios from 'axios';
import React from 'react';

let axiosInstance = axios.create({
    baseURL:`https://b11a12-server-side-sariakhatun.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;