//App.jsx

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';  // HomePage component
import Form from './components/Form';  // Placeholder for Form component
import AllListings from './components/AllListings';  // Placeholder for AllListings component
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedPage from "./components/ProtectedPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route for HomePage */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Nested routes under /home */}
          <Route path="/home/form" element={<Form />} />
          <Route path="/home/allListings" element={<AllListings />} />


          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/protected" element={<ProtectedPage />} />
          {/* Route for login under /auth */}
          <Route path="/auth/login" element={<div>Login Page</div>} />
          <Route path="/auth/register" element={<div>Register Page</div>} />
          
          {/* Fallback route for 404 (Page Not Found) */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
