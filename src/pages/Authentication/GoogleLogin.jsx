import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const GoogleLogin = () => {
    let {singInWithGoogle}=useAuth();
    let navigate = useNavigate()
    let handleGoogleSignIn = ()=>{
        singInWithGoogle()
        .then(res=>{
            console.log(res.user);
            Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logged in Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  navigate('/')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <div>
            <p className='text-center my-4'>OR</p>
            <Button onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </Button>
        </div>
    );
};

export default GoogleLogin;