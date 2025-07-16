import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import GoogleLogin from "./GoogleLogin";
import GithubLogin from "./GithubLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  let navigate = useNavigate();
  let { loginUser } = useAuth();
  let location = useLocation();
  let from = location.state?.from || '/';

  const onSubmit = (data) => {
    console.log("Registering user:", data);

    loginUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged in Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);
      })
      .catch((error) => {
        console.error("Login error:", error.message);

        if (error.code === "auth/user-not-found") {
          Swal.fire("Error", "Email not registered. Please register first.", "error");
          setError("email", { type: "manual", message: "Email not registered" });
        } else if (error.code === "auth/wrong-password") {
          Swal.fire("Error", "Incorrect password", "error");
          setError("password", { type: "manual", message: "Incorrect password" });
        } else if (error.code === "auth/too-many-requests") {
          Swal.fire("Error", "Too many failed attempts. Try again later.", "error");
        } else if (error.code === "auth/network-request-failed") {
          Swal.fire("Error", "Network issue. Please check your connection.", "error");
        } else {
          Swal.fire("Error", error.message, "error");
        }
      });
  };

  return (
    <section className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center text-[#1F2937] mb-6">
        Login Your Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <small>Forgot password</small>
        </div>

        {/* Register Button */}
        <div>
          <Button
            type="submit"
            className="w-full bg-[#34B7A7] hover:bg-[#2fa396] text-white"
          >
            Login
          </Button>
          <p className="">
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
        <GoogleLogin />
        <GithubLogin />
      </div>
    </section>
  );
};

export default Login;
