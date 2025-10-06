import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Sidebar from "./Components/Sidebar";
import Reports from './Pages/Reports';
import Approvals from './Pages/Approvals';
import Login from './Pages/Login';

import Complaints from './Pages/Complaints';
import { useSelector } from "react-redux";
import Signup from './Pages/Signup';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);
export default function App() {
  // get user from redux store
  const user = useSelector((state) => state.home.user);

  return (
    <BrowserRouter>
      {user?.uid ? (
        <>
          <Sidebar />
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Approvals" element={<Approvals />} />
            {/*<Route path="/Login" element={<Login />} /> */}
            <Route path="/Complaints" element={<Complaints />} />
          
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}