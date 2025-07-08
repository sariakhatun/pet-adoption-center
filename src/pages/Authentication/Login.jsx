
import React from 'react';
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { useState } from "react"
import { Link } from 'react-router';
const Login = () => {
     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
       const [imagePreview, setImagePreview] = useState(null);
    
       const onSubmit = (data) => {
        console.log("Registering user:", data)
        // TODO: Upload image to cloud and handle registration
      }
    
      const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
          setImagePreview(URL.createObjectURL(file))
        }
      }
        return (
        <section className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-center text-[#1F2937] mb-6">
            Login Your Account
          </h2>
    
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           
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
           <div>
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
            <small>Forgot password</small>
    
           </div>
           
    
            {/* Register Button */}
           <div>
             <Button type="submit" className="w-full bg-[#34B7A7] hover:bg-[#2fa396] text-white">
              Register
            </Button>
            <p className=''>
            <small>
              Don't have an account? 
              <Link to="/register" className="font-bold hover:text-[#34B7A7] ">
                 Register
              </Link>{" "}
            </small>
          </p>
           </div>
          </form>
    
          {/* Social Login */}
          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-red-500" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FaGithub className="text-black" />
              Continue with GitHub
            </Button>
             
          </div>
        </section>
      )
};

export default Login;