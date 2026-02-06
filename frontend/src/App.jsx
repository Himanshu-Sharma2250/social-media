import {Routes, Route, Navigate} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { Loader } from "lucide-react"

import './App.css'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import FeedPage from './pages/FeedPage'
import PostCard from './components/PostCard'
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  
  useEffect( () => {
     checkAuth();
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-start">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

    return (
      <>
        <Toaster />
        <Routes>
          <Route path="/login" element={!authUser ? <SignInPage /> : <Navigate to={"/"}/>} />

          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"}/>} />

          <Route path="/" element={authUser ? <FeedPage currentUser={authUser} /> : <Navigate to={"/login"}/>} />
        </Routes>
      </>
    )
}

export default App
