import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '@/hooks/useAuth';
import Swal from 'sweetalert2';
import GoogleLogin from './GoogleLogin';
import GithubLogin from './GithubLogin';
import axios from 'axios';
import useAxios from '@/hooks/useAxios';
import LottieAnimation from './LottieAnimation';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const axiosInstance = useAxios();
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("Registering user:", data);
      const res = await createUser(data.email, data.password);
      console.log(res.user);

      // Prepare user info for database
      const userInfo = {
        email: data.email,
        name: data.name,
        phone: data.phone,       // new
        address: data.address,   // new
        photoURL: imagePreview,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Save user to backend
      const userRes = await axiosInstance.post('/users', userInfo);
      console.log('User response:', userRes.data);

      // Update Firebase profile
      const userProfile = {
        displayName: data.name,
        photoURL: imagePreview
      };
      await updateUserProfile(userProfile);
      console.log('Profile updated successfully');

      // Success alert
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registered Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(from);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong during registration!',
      });
    }
  };

  // Handle image upload
  const handleFileChange = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`, formData);
    setImagePreview(res.data.data.url);
  };

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto gap-6 lg:gap-12 mt-24 items-center px-4">
      {/* Form Section */}
      <section className="max-w-full flex-1 mx-auto mt-24 p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-[#1F2937] dark:text-white mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className='space-y-2'>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Profile Image */}
          <div className='space-y-2'>
            <Label htmlFor="photo">Upload Profile Picture</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              {...register("photo", { required: "Profile picture is required" })}
              onChange={handleFileChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-20 w-20 object-cover rounded-full"
              />
            )}
            {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Phone Number */}
          <div className='space-y-2'>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div className='space-y-2'>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter your address"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Register Button */}
          <div>
            <Button type="submit" className="w-full bg-[#34B7A7] hover:bg-[#2fa396] text-white">
              Register
            </Button>
            <p className="mt-2 text-center">
              <small>
                Already have an account?{' '}
                <Link to="/login" className="hover:text-[#34B7A7] font-bold">
                  Login
                </Link>
              </small>
            </p>
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          <GoogleLogin />
          <GithubLogin />
        </div>
      </section>

      {/* Animation Section */}
      <div className="flex-1 flex items-center justify-center">
        <LottieAnimation loop={true} style={{ width: 400, height: 400 }} />
      </div>
    </div>
  );
};

export default Register;
