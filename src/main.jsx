import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './router/router';
import AuthProvider from './context/AuthContext/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
let queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
    <AuthProvider>
       <RouterProvider router={router}></RouterProvider>
  
     </AuthProvider>
   </QueryClientProvider>
     
  </StrictMode>,
)
