import React from 'react';
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { useState } from "react"
import { Link, useNavigate } from 'react-router';
import useAuth from '@/hooks/useAuth';
import Swal from 'sweetalert2';
import GoogleLogin from './GoogleLogin';
import GithubLogin from './GithubLogin';
import axios from 'axios';
const Register = () => {
     const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
   const [imagePreview, setImagePreview] = useState(null);
   let {createUser,updateUserProfile}=useAuth()
  let navigate = useNavigate()
   const onSubmit = (data) => {
    console.log("Registering user:", data)
    // TODO: Upload image to cloud and handle registration
    console.log(createUser)
    createUser(data.email,data.password)
    .then(res=>{
      console.log(res.user)

      //update userinfo in the database


      //update user profile in firebase
      let userProfile ={
        displayName : data.name,
        photoURL : imagePreview


      }
      updateUserProfile(userProfile)
      .then(()=>{
        console.log('profile name and image updated',)
      })
      .catch(error=>{
        console.log(error)
      })


      a
              navigate('/')
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const handleFileChange =async (e) => {
    const image = e.target.files[0]
   // console.log(image)
    let formData = new FormData();
    formData.append('image',image);

    let res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Upload_Key}`,formData)
    console.log(res.data.data.url)
    setImagePreview(res.data.data.url)
  }
    return (
    <section className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center text-[#1F2937] mb-6">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
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

       

        {/* Register Button */}
        <div>
            <Button type="submit" className="w-full bg-[#34B7A7] hover:bg-[#2fa396] text-white">
          Register
        </Button>
            <p>
            <small>
              Already have an account?
              <Link to="/login" className="hover:text-[#34B7A7] font-bold">
                Login
              </Link>{" "}
            </small>
          </p>
        </div>
        
         
      </form>

      {/* Social Login */}
      <div className="mt-6 space-y-3">
        <GoogleLogin></GoogleLogin>
        <GithubLogin></GithubLogin>
      </div>
    </section>
  )
}
export default Register;