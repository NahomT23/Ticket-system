import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import TicketDetails from './pages/TicketDetails';
import UpdateTicket from './pages/updateTicket';
import ProtectedRoute from './components/ProtectedRoute';
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>

      <ToastContainer/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Routes with Header */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Header />
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <Header />
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute>
              <Header />
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/update/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <Header />
              <UpdateTicket />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;