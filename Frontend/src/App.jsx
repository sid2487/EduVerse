import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import CourseCreate from './admin/CourseCreate'
import UpdateCourse from './admin/UpdateCourse'
import OurCourse from './admin/OurCourse'

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        <Route path='/courses' element={<Courses />} />
        <Route path='/buy/:courseId' element={<Buy />} />
        <Route path='/purchases' element={user ? <Purchases /> : <Navigate to={"/login"} />} />

        <Route path='admin/signup' element={<AdminSignup />} />
        <Route path='admin/login' element={<AdminLogin />} />

        <Route path='admin/dashboard' element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />} />

        <Route path='admin/create-course' element={<CourseCreate />} />
        <Route path='admin/update-course/:id' element={<UpdateCourse />} />
        <Route path='admin/our-courses' element={<OurCourse />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App