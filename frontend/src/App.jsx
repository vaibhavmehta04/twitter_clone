import { Route,Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notifications/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';

import LoadingSpinner from "./components/common/LoadingSpinner";



function App() {
  const {data:authUser,isLoading,error,isError} = useQuery({
    queryKey: ["authUser"],
    queryFn: async()=> {
      try {
        const res =await fetch("http://localhost:8000/api/auth/me",{
          credentials:"include",
        });
        
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        console.log("auth user is here",data);
        return data;
          
        
      } catch (error) {
        throw new Error(error);
        
      }
    },
    retry: false,
  });
  if (isLoading) {
  return (
    <div className='h-screen flex justify-center items-center'>
      <LoadingSpinner size='lg' />
    </div>
  );
}
  

  return (
<div className='flex max-w-6xl mx-auto'>
 {authUser && <Sidebar authUser={authUser} />}

{!authUser &&<Spline
  scene="https://prod.spline.design/Uiq7O7JQ2JL4ValT/scene.splinecode" 
  
  style={{ width: '700px', height: '800px' }}
/>}
  <Routes>
    <Route path='/' element={authUser? <HomePage /> : <Navigate to="/login" />} />
    <Route path='/signup' element={!authUser ? <SignUpPage /> :<Navigate to="/" />} />
    <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
    <Route path='/notifications' element={authUser?<NotificationPage /> : <Navigate to="/login" />} />
    <Route path='/profile/:username' element={authUser?<ProfilePage /> : <Navigate to="/login" />} />
  </Routes>
  {authUser && <RightPanel />}
  <Toaster />

</div>
  )
}

export default App
