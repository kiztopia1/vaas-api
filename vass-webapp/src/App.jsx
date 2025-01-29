import { useState } from 'react'
import { Routes, Route, Navigate, Router } from 'react-router-dom'
import './App.css'

import Login from './Pages/Login'
import Signup from './Pages/Signup'
import { AuthProvider } from './Auth/AuthContext'
import ProtectedRoute from './Auth/ProtectedRoute'
import MainDashboard from './Pages/MainDashboard'
function App() {
  return (
    <div className="main">
      <main className="max-w-7xl mx-auto">
        <AuthProvider>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/" element={<MainDashboard />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}></Route>
          </Routes>
        </AuthProvider>
      </main>
    </div>
  )
}

export default App
