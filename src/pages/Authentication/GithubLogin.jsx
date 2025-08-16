import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase.init"; // 👈 Your own config


const GithubLogin = () => {
  let { signInWithGithub } = useAuth();
  let navigate = useNavigate();
  let axiosInstance = useAxios();
 let location = useLocation();
   let from = location.state?.from || '/'
  const handleGithubSignIn = () => {
    signInWithGithub()
      .then(async (res) => {
        let user = res.user;

        let userInfo = {
          email: user.email,
          name: user.displayName || "GitHub User",
          photoURL: user.photoURL || "",
          role: "user",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        await axiosInstance.post("/users", userInfo);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged in Successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate(from);
      })
      .catch(async (error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          const email = error.customData?.email;
          const methods = await fetchSignInMethodsForEmail(auth, email);
          const method = methods[0]?.replace(".com", "");

          Swal.fire({
            icon: "warning",
            title: "Email already registered",
            html: `This email is already registered using <b>${method}</b>. Please log in using that provider.`,
          });
        } else {
          console.error("GitHub Login Error:", error);
          Swal.fire({
            icon: "error",
            title: "GitHub Login Failed",
            text: error.message,
          });
        }
      });
  };

  return (
    <div>
      <Button
        onClick={handleGithubSignIn}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <FaGithub className="text-black dark:text-white" />
        Continue with GitHub
      </Button>
    </div>
  );
};

export default GithubLogin;
