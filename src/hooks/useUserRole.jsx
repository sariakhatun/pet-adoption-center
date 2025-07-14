import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUserRole = () => {
  const { user,loading:authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = 'user',
    isLoading:roleLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}/role`);
      return res.data.role;
    },
  });
  console.log("Role Loading:", roleLoading);
console.log("Role:", role);


  return {
    role,
    roleLoading: authLoading || roleLoading,
    isError,
    error,
   
  };
};

export default useUserRole;
